import tkinter as tk;
from functools import partial;
from os import stat;
import http.client;
import io;

#Number of ports in case ports are added/removed
numPorts = 16

class SwitchGUI(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self);
        self.master = master;
        self.frame = tk.Frame(self.master);
        master.title("USB Switch Interface");

        #Open the settings file so name changes can be permanently saved
        try:
            self.settings_file = open("./config.txt", "r+");
        except IOError:
            self.settings_file = open("./config.txt", "w+");
        
        #Create widgets
          #label creation gets its own function for creation and packing so that it can be called again whenever names are changed. Other widgets are static, so no function
        self.buttonVar = [];
        for i in range(numPorts):
            self.buttonVar.append(1);
        self.portNumbers = [];
        self.makeButtons();
          #the checkboxes to turn ports on and off

          #activate and deativate all buttons, as well as an exit button and a button to change the names assigned to the ports
        activateAllButton = tk.Button(master, text = "Activate all ports", command = lambda: self.activateAllPorts(self.portCheckBoxes));
        deactivateAllButton = tk.Button(master, text = "Deactivate all ports", command = lambda: self.deactivateAllPorts(self.portCheckBoxes));
        exitButton = tk.Button(master, text = "Exit", command = self.exit);
        settingsButton = tk.Button(master, text = "Settings", command = self.makeSettingsWindow);
        
        #Place widgets into GUI
        activateAllButton.grid(column = 0, row = 0, sticky = "w" + "e");
        deactivateAllButton.grid(column = 1, row = 0, sticky = "w" + "e");
        exitButton.grid(row = numPorts + 2, sticky = "w" + "e");
        settingsButton.grid(column = 1, row = numPorts + 2, sticky = "w" + "e");
        
    #Define functions
      #make the labels for the GUI, then call the packing function
    def makeButtons(self):
        #if the labels have already been made, they need to be destroyed, otherwise the new labels will just be placed on top of the old ones
        if(len(self.portNumbers) != 0):
            for i in range(numPorts):
                GUI.portNumbers[i].destroy();
        self.labelVars = [];
        self.portNumbers = [];
        self.settings_file.seek(0);
        i = 0;
        for line in self.settings_file:
            i += 1;
        self.settings_file.seek(0);
        if(i == numPorts):
            for i in range(numPorts):
                var = tk.StringVar();
                var.set(self.settings_file.readline().rstrip());
                self.labelVars.append(var);
                self.portNumbers.append(tk.Button(self.master, textvariable = self.labelVars[i], command = partial(self.portInteract, i)));
        else:
            for i in range(numPorts):
                var = tk.StringVar();
                var.set("Port " + str(i + 1));
                self.settings_file.write(var.get() + "\n");
                self.labelVars.append(var);
                self.portNumbers.append(tk.Button(self.master, textvariable = self.labelVars[i], command = partial(self.portInteract, i)));
        self.packButtons();
        return;
      #put the labels in the GUI
    def packButtons(self):
        for i in range(numPorts):
            self.portNumbers[i].grid(column = 0, row = i + 1, columnspan = 2, padx = 25, pady = 5);
        return;
      #make the settings window
    def makeSettingsWindow(self):
        self.settings = settings(tk.Toplevel(self), self);
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
    def portInteract(self, i):
        if(self.buttonVar[i]):
            self.turnPortOn(i);
            self.buttonVar[i] = 0;
        else:
            self.turnPortOff(i);
            self.buttonVar[i] = 1;
        return;
      #turn on a port
    def turnPortOn(self, portNum):
        switchConnect = http.client.HTTPConnection("10.10.1.229");
        if(portNum < 6):
            urlExtension = "/8080/0" + str(portNum * 2 + 1);
        else:
            urlExtension = "/8080/" + str(portNum * 2 + 1);
        switchConnect.request("GET", urlExtension);
        switchConnect.getresponse();
        switchConnect.close();
        self.portNumbers[portNum].config(bg = "lime green");
        return;
      #turn off a port
    def turnPortOff(self, portNum):
        switchConnect = http.client.HTTPConnection("10.10.1.229");
        if(portNum < 6):
            urlExtension = "/8080/0" + str(portNum * 2);
        else:
            urlExtension = "/8080/" + str(portNum * 2);
        switchConnect.request("GET", urlExtension);
        switchConnect.getresponse();
        switchConnect.close();
        self.portNumbers[portNum].config(bg = "SystemButtonFace");
        return;
      #close the settings file and exit the GUI
    def exit(self):
        self.settings_file.close();
        self.master.destroy();
        return;

class settings(tk.Frame):
    def __init__(self, master, GUI):
        tk.Frame.__init__(self);
        self.master = master;
        master.title("Settings");

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
        restoreDefaultsButton = tk.Button(master, text = "Restore default port names", command = self.restoreDefaults);
        exitButton = tk.Button(master, text = "Exit", command = master.destroy);

        #Put the widgets in the settings window
        restoreDefaultsButton.grid(columnspan = 2, sticky = "w" + "e");
        for i in range(numPorts):
            self.labels[i].grid(row = i + 2, padx = 25, pady = 5);
            self.entryBoxes[i].grid(column = 1, row = i + 2);
        saveChangesButton.grid(row = numPorts + 2, column = 1, sticky = "w" + "e");
        exitButton.grid(row = numPorts + 2, sticky = "w" + "e");

    #Define functions
      #the "save settings" function. Recreates the settings file with the desired name changes included
    def changeLabels(self):
        settings_file = GUI.settings_file;
        newLabels = [];
        #create an array with every label desired, including unchanged ones
        j = 0;
        settings_file.seek(0);
        for line in settings_file:
            if(j < numPorts):
                if(len(self.entryBoxes[j].get()) != 0):
                    newLabels.append(self.entryBoxes[j].get());
                    self.entryBoxes[j].delete(0, "end");
                else:
                    newLabels.append(GUI.labelVars[j].get());
            j += 1;
        #empty the config file
        settings_file.seek(0);
        settings_file.truncate();
        #write the new labels to it
        for i in range(numPorts):
            settings_file.write(newLabels[i] + "\n");
        GUI.makeButtons();
        self.makeSettingsLabels();
        return;
      #rewrites the config file with default names
    def restoreDefaults(self):
        settings_file = GUI.settings_file;
        settings_file.seek(0);
        for i in range(numPorts):
            settings_file.write("Port " + str(i + 1) + "\n");
        GUI.makeButtons();
        self.makeSettingsLabels();
        return;
      #remakes and packs the port labels so they update in the settings window
    def makeSettingsLabels(self):
        for i in range(numPorts):
            self.labels[i].destroy();
            self.labels[i] = tk.Label(self.master, textvariable = GUI.labelVars[i]);
            self.labels[i].grid(row = i + 2, padx = 25, pady = 5);
        return;

#Establish a connection to the switch. If the switch is not found, report it
def testConnection():
    try:
        connect1 = http.client.HTTPConnection("10.10.1.229");
        connect1.request("GET", "/8080");
        connect1.getresponse();
        connect1.close();
        print("Connection established");
        return True;
    except TimeoutError:
        print("Connection could not be established. Ensure everything is plugged in and try again");
        input("Press Enter to continue . . . ");
        return False;

#Instantiate GUI if switch is connected    
if(testConnection()):
    root = tk.Tk();
    GUI = SwitchGUI(root);
    root.mainloop();
