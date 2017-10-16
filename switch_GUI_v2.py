import tkinter as tk;
from functools import partial;
from os import stat;
import http.client;
import io;

#Number of ports in case ports are added/removed. Global because all classes use it and it doesn't change through the code
numPorts = 16

class SwitchGUI(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self);
        self.master = master;
        self.frame = tk.Frame(self.master);
        master.title("USB Switch Interface");
        master.minsize(width = 200, height = 548);

        #Open the settings file so name changes can be permanently saved
        try:
            settings_file = open("config.txt", "r+");
            if(stat("config.txt").st_size != 0):
                settings_set = True;
            else:
                settings_set = False;
        except IOError:
            settings_file = open("config.txt", "w");
            settings_set = False;
        
        #Create widgets
          #all the labels for the ports, reading them from the settings file if it exists, otherwise creating them and writing them to the settings file
        self.labelVars = [];
        self.portNumbers = [];
        if(settings_set):
            for i in range(numPorts):
                var = tk.StringVar();
                var.set(settings_file.readline().rstrip());
                self.labelVars.append(var);
                self.portNumbers.append(tk.Label(master, textvariable = self.labelVars[i]));
        else:
            for i in range(numPorts):
                var = tk.StringVar();
                var.set("Port " + str(i + 1));
                settings_file.write(var.get() + "\n");
                self.labelVars.append(var);
                self.portNumbers.append(tk.Label(master, textvariable = self.labelVars[i]));
          #the checkboxes to turn ports on and off
        self.checkVar = [];
        self.portCheckBoxes = [];
        for i in range(numPorts):
            self.checkVar.append(tk.IntVar());      
            self.portCheckBoxes.append(tk.Checkbutton(master, text = "Active?", variable=self.checkVar[i], command = partial(self.portInteract, self.checkVar[i], i)));

          #activate and deativate all buttons, as well as an exit button and a button to change the names assigned to the ports
        activateAllButton = tk.Button(master, text = "Activate all ports", command = lambda: self.activateAllPorts(self.portCheckBoxes));
        deactivateAllButton = tk.Button(master, text = "Deactivate all ports", command = lambda: self.deactivateAllPorts(self.portCheckBoxes));
        exitButton = tk.Button(master, text = "Exit", command = master.destroy);
        settingsButton = tk.Button(master, text = "Settings", command = self.makeSettings);
        
        #Place widgets into GUI
        activateAllButton.grid(column = 0, sticky = "w" + "e");
        deactivateAllButton.grid(column = 1, row = 0, sticky = "w" + "e");
        for i in range(numPorts):
            self.portNumbers[i].grid(column = 0, row = i + 1, padx = 25, pady = 5);
            self.portCheckBoxes[i].grid(column = 1, row = i + 1);
        exitButton.grid(row = numPorts + 2, sticky = "w" + "e");
        settingsButton.grid(column = 1, row = numPorts + 2, sticky = "w" + "e");

        settings_file.close();
        
    #Define functions
      #make the settings window
    def makeSettings(self):
        newWindow = tk.Toplevel(self);
        self.settings = settings(newWindow, self);
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
      #determine which port a clicked box corresponds to, and whether to turn it on or off
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

class settings(tk.Frame):
    def __init__(self, master, GUI):
        tk.Frame.__init__(self);
        self.master = master;
        master.title("Settings");
        master.minsize(width = 175, height = 575);

        #The settings file will exist at this point, so no need to check before opening
        settings_file = open("config.txt", "r+");

        #Create widgets
          #make labels using the already made SwitchGUI label variables, and create the entry boxes for taking in name changes
        self.labels = [];
        self.entryVars = [];
        self.entryBoxes = [];
        for i in range(numPorts):
            self.labels.append(tk.Label(master, textvariable = GUI.labelVars[i]));
            self.entryVars.append(tk.StringVar());
            self.entryBoxes.append(tk.Entry(master, textvariable = self.entryVars[i], width = 13));
          #make buttons to save desired name changes, restore default port names, and exit settings
        saveChangesButton = tk.Button(master, text = "Save changes?", command = self.changeLabels);
        restoreDefaultsButton = tk.Button(master, text = "Restore defaults", command = self.restoreDefaults);
        exitButton = tk.Button(master, text = "Exit", command = master.destroy);

        #Put the widgets in the settings window
        restoreDefaultsButton.grid(sticky = "w" + "e");
        saveChangesButton.grid(row = 0, column = 1, sticky = "w" + "e");
        for i in range(numPorts):
            self.labels[i].grid(row = i + 2, padx = 25, pady = 5);
            self.entryBoxes[i].grid(column = 1, row = i + 2);
        exitButton.place(relx = .42, rely = .93);

        settings_file.close();

    #Define functions
      #the "save settings" function. Recreates the settings file with the desired name changes included
    def changeLabels(self):
        settings_file = open("config.txt", "r+");
        newLabels = [];
        #create an array with every label desired, including unchanged ones
        for line in settings_file:
            #ensure that extra lines in the config file will be ignored
            for i in range(numPorts):
                if(len(self.entryBoxes[i].get()) != 0):
                    newLabels.append(self.entryBoxes[i].get());
                else:
                    newLabels.append(GUI.labelVars[i].get());
        #empty the config file
        settings_file.seek(0);
        settings_file.truncate();
        #write the new labels to it
        for i in range(numPorts):
            settings_file.write(newLabels[i] + "\n");
        settings_file.close();
        return;

      #rewrites the config file with default names
    def restoreDefaults(self):
        settings_file = open("config.txt", "w");
        for i in range(numPorts):
            settings_file.write("Port " + str(i + 1) + "\n");
        settings_file.close();
        return;
    
#Establish a connection to the switch. If connection is not established the GUI will not instantiate
connect1 = http.client.HTTPConnection("10.10.1.229");
connect1.request("GET", "/8080");
connect1.getresponse();
connect1.close();
#Instantiate GUI
root = tk.Tk();
GUI = SwitchGUI(root);
root.mainloop();
