import tkinter as tk;
from functools import partial;
import http.client;

class SwitchGUI(tk.Frame):
    def __init__(self, master):
        self.master = master;
        master.title("USB Switch Interface");
        master.minsize(width = 200, height = 575);
        #Number of ports in case ports are added/removed
        numPorts = 16

        #Create widgets
          #all the labels for the ports
        portNumbers = [tk.Label(master, text = "Port " + str(i + 1)) for i in range(numPorts)];

          #the checkboxes for the ports. This took extra space due to how python handles variables
        checkVar = [];
        for i in range(numPorts):
            checkVar.append(tk.IntVar());      
        portCheckBoxes = [tk.Checkbutton(master, text = "Active?", variable=checkVar[i], command = partial(self.portInteract, checkVar[i], i))for i in range(numPorts)];

          #activate and deativate all buttons, as well as an exit button and a button to view the values of the checkboxes in the console
        activateAllButton = tk.Button(master, text = "Activate all ports", command = lambda: self.activateAllPorts(portCheckBoxes));
        deactivateAllButton = tk.Button(master, text = "Deactivate all ports", command = lambda: self.deactivateAllPorts(portCheckBoxes));
        exitButton = tk.Button(master, text = "Exit", command = master.destroy);
        testButton = tk.Button(master, text = "Peek", command = lambda: self.printValues(checkVar));
        
        #Place widgets into GUI
        activateAllButton.grid(column = 0);
        deactivateAllButton.grid(column = 1, row = 0);
        for i in range(numPorts):
            portNumbers[i].grid(column = 0, row = i + 1, padx = 25, pady = 5);
            portCheckBoxes[i].grid(column = 1, row = i + 1);
        exitButton.place(relx = .42, rely = .93);
        testButton.grid(column = 1, row = 18);

    #define functions
      #print the values of the checkboxes for testing purposes
    def printValues(self, checkVars):
        for i in range(16):
            print("port " + str(i) + " = " + str(checkVars[i].get())); 
        return;
      #activate all the checkboxes
    def activateAllPorts(self, checkBoxes):
        for box in checkBoxes:
            box.deselect();
            box.invoke();
        return;
      #deactivate all the checkboxes
    def deactivateAllPorts(self, checkBoxes):
        for box in checkBoxes:
            box.select();
            box.invoke();
        return;
      #Determine whether to turn the clicked port on or off
    def portInteract(self, checkVar, i):
        if(checkVar.get()):
            self.turnPortOn(i + 1);
        else:
            self.turnPortOff(i + 1);
        return;
      #turn on a port
    def turnPortOn(self, portNum):
        switchConnect = http.client.HTTPConnection("10.10.1.229");
        if(portNum < 6):
            urlExtension = "/8080/0" + str(portNum * 2 - 1);
        else:
            urlExtension = "/8080/" + str(portNum * 2 - 1);
        switchConnect.request("GET", urlExtension);
        switchConnect.getresponse();
        switchConnect.close();
        return;
      #turn off a port
    def turnPortOff(self, portNum):
        switchConnect = http.client.HTTPConnection("10.10.1.229");
        if(portNum < 6):
            urlExtension = "/8080/0" + str(portNum * 2 - 2);
        else:
            urlExtension = "/8080/" + str(portNum * 2 - 2);
        switchConnect.request("GET", urlExtension);
        switchConnect.getresponse();
        switchConnect.close();
        return;
    
#Instantiate GUI
root = tk.Tk();
GUI = SwitchGUI(root);
root.mainloop();
