/*#########################################################################
#                                                                         #
#   Simple script shamelessly recopied from:                              #
#                                                                         #
#   Copyright                                                             #
#                                                                         #
#   (C)  2019 Carlos H. Antunes <hantunes@gmx.com>                        #
#                                                                         #
#   This program is free software; you can redistribute it and/or modify  #
#   it under the terms of the GNU General Public License as published by  #
#   the Free Software Foundation; either version 2 of the License, or     #
#   (at your option) any later version.                                   #
#                                                                         #
#   This program is distributed in the hope that it will be useful,       #
#   but WITHOUT ANY WARRANTY; without even the implied warranty of        #
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         #
#   GNU General Public License for more details.                          #
#                                                                         #
#   You should have received a copy of the GNU General Public License     #
#   along with this program; if not, write to the                         #
#   Free Software Foundation, Inc.,                                       #
#   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.         #
##########################################################################*/

Importer.loadQtBinding("qt.core");
Importer.loadQtBinding("qt.gui");

function Station(name, url) {
    this.name = name;
    this.url = url;
}

categories = {};

categories["  Vancouver"] = new Array(
    new Station("Rock 101", "https://live.leanstream.co/CFMIFM?args=web_01&startTime=1570931145")
);


function CanadianRadios() {
    ScriptableServiceScript.call(this, "Canadian Radios", 2, "List of Canadian radios", "A collection of radios from many cities in Canada", true);
    Amarok.debug("ok.");
}


function onConfigure() {
    Amarok.alert("This script does not require configuring.");
}

function onPopulating(level, callbackData, filter) {
    // For some reason Amarok appends a "%20", remove it
    filter = filter.toLowerCase().replace("%20", "");

    if (level == 1) {
        for (att in categories) {
            if (filter.length > 0) {
                var hasItems = false;
                var stationArray = categories[att];
                for (i = 0; i < stationArray.length; i++) {
                    if (stationArray[i].name.toLowerCase().indexOf(filter) !== -1) {
                        hasItems = true;
                        break;
                    }
                }
                if (!hasItems) continue;
            }

            var cover = Amarok.Info.scriptPath() + "/" + "radio.png";
            Amarok.debug("att: " + att + ", " + categories[att].name);

            item = Amarok.StreamItem;
            item.level = 1;
            item.callbackData = att;
            item.itemName = att;
            item.playableUrl = "";
            item.infoHtml = "";
            item.coverUrl = cover;
            script.insertItem(item);

        }
        script.donePopulating();
    } else if (level == 0) {
        Amarok.debug(" Populating station level...");

        var stationArray = categories[callbackData];

        for (i = 0; i < stationArray.length; i++) {
            name = stationArray[i].name;
            if (name.toLowerCase().indexOf(filter) == -1) continue;
            item = Amarok.StreamItem;
            item.level = 0;
            item.callbackData = "";
            item.itemName = stationArray[i].name;
            item.playableUrl = stationArray[i].url;
            item.album = stationArray[i].name;
            item.artist = "Radio Stream";
            item.coverUrl = cover;
            script.insertItem(item);
        }
        script.donePopulating();
    }
}

function onCustomize() {
    var currentDir = Amarok.Info.scriptPath() + "/";
    var iconPixmap = new QPixmap(currentDir + "icon.png");
    script.setIcon(iconPixmap);
}

Amarok.configured.connect(onConfigure);

script = new CanadianRadios();
script.populate.connect(onPopulating);
script.customize.connect(onCustomize);
