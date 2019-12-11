'use strict'

//#region Variables
const electron = require("electron"),
    {
        app,
        shell,
        BrowserWindow,
        ipcMain,
        Menu,
        Tray
    } = electron,
    path = require("path"),
    fs = require("fs"),
    {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS
    } = require('electron-devtools-installer'),
    isDev = require("electron-is-dev"),
    rootFolder = isDev ? process.cwd() : path.resolve(app.getAppPath(), '../../')

let mainWindow = null,
    tray,
    trayMenu = null,
    applicationMenu = null,
    x,
    y,
    currentScreen

//#endregion

//#region Initial Setup
let setupCommunication = () => {

    //Example handling of communication from the renderer process
    ipcMain.on("log", args => {

        if (mainWindow) {

            mainWindow.webContents.send("mainLog", args)

        }

    })

    ipcMain.on("toggleDevTools", () => toggleDevTools())

    ipcMain.on("logData", (e, args) => logData(args))

    ipcMain.on("constructLog", (e, args) => constructLogFile(args))

}

const logData = (data) => {

    logAction(data.name, data.appStart ? data.appStart : false, data.timeout ? data.timeout : false)

}

const constructLogFile = data => {

    // console.log(data)

    let directory = `${app.getPath("desktop")}/log`,
        fileName = `${directory}/${app.getName().replace(/ /g,"_").toLowerCase()}_log.json`,
        json

    if (!fs.existsSync(directory)) {

        fs.mkdirSync(directory, {
            recursive: true
        })

        // console.log(`${directory} created`)

    }

    if (!fs.existsSync(fileName)) {

        json = {
            showName: data.showName,
            timestamps: {
                created: dateFormat(),
                updated: dateFormat()
            },
            items: data.items.length,
            tracking: []
        }

        data.items.forEach((logItem, i) => {

            if (logItem.holding) {

                json.tracking.push({
                    name: logItem.name ? logItem.name : `Page ${i + 1}`,
                    hits: 0,
                    appStart: 0,
                    timeout: 0
                })

            } else {

                json.tracking.push({
                    name: logItem.name ? logItem.name : `Page ${i + 1}`,
                    hits: 0
                })

            }

        })

        // console.log(json)

        fs.writeFile(fileName, JSON.stringify(json, null, 4), "utf8", err => {

            if (err) throw err

            // console.log(`${fileName} created`)

        })

    }

}



const logAction = (action, appStart = false, timeout = false) => {

    let directory = `${app.getPath("desktop")}/log`,
        fileName = `${directory}/${app.getName().replace(/ /g,"_").toLowerCase()}_log.json`,
        json

    if (fs.existsSync(fileName)) {

        fs.readFile(fileName, "utf8", (err, data) => {

            if (err) throw err

            let json = JSON.parse(data)

            // console.log(json)

            if (json.tracking.length > 0) {

                let element = json.tracking.filter(trackingItem => trackingItem.name == action)

                // console.log(element)

                if (element.length > 0) {

                    element[0].hits++

                    if (appStart) {

                        element[0].appStart++

                    }

                    if (timeout) {

                        element[0].timeout++

                    }

                } else {

                    json.items++

                    json.tracking.push({
                        name: action,
                        hits: 1
                    })

                }

            } else {

                json.items++

                json.tracking.push({
                    name: action,
                    hits: 1
                })



            }

            json.timestamps.updated = dateFormat()

            fs.writeFile(fileName, JSON.stringify(json, null, 4), "utf8", err => {

                if (err) throw err

                // console.log(`${fileName} appended`)

            })

        })

    }

    return

}

/**
 * Return a formated string from a date Object mimicking PHP's date() functionality
 *
 * format  string  "Y-m-d H:i:s" or similar PHP-style date format string
 * date    mixed   Date Object, Datestring, or milliseconds
 *
 */
const dateFormat = (format = "Y-m-d H:i:s", date = new Date()) => {

    if (typeof (date) !== 'object') {

        date = new Date(date.replace(/-/g, "/")) // attempt to convert string to date object

    }

    let string = '',
        mo = date.getMonth(), // month (0-11)
        m1 = mo + 1, // month (1-12)
        dow = date.getDay(), // day of week (0-6)
        d = date.getDate(), // day of the month (1-31)
        y = date.getFullYear(), // 1999 or 2003
        h = date.getHours(), // hour (0-23)
        mi = date.getMinutes(), // minute (0-59)
        s = date.getSeconds(), // seconds (0-59)
        days,
        months,
        hour

    for (var i = 0; i < format.length; i++) {

        switch (format[i]) {

            case 'j': // Day of the month without leading zeros  (1 to 31)

                string += d

                break

            case 'd': // Day of the month, 2 digits with leading zeros (01 to 31)

                string += (d < 10) ? "0" + d : d

                break

            case 'l': // (lowercase 'L') A full textual representation of the day of the week

                days = Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")

                string += days[dow]

                break

            case 'w': // Numeric representation of the day of the week (0=Sunday,1=Monday,...6=Saturday)

                string += dow

                break

            case 'D': // A textual representation of a day, three letters

                days = Array("Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat")

                string += days[dow]

                break

            case 'm': // Numeric representation of a month, with leading zeros (01 to 12)

                string += (m1 < 10) ? "0" + m1 : m1

                break

            case 'n': // Numeric representation of a month, without leading zeros (1 to 12)

                string += m1

                break

            case 'F': // A full textual representation of a month, such as January or March

                months = Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")

                string += months[mo]

                break

            case 'M': // A short textual representation of a month, three letters (Jan - Dec)

                months = Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

                string += months[mo]

                break

            case 'Y': // A full numeric representation of a year, 4 digits (1999 OR 2003)

                string += y

                break

            case 'y': // A two digit representation of a year (99 OR 03)

                string += y.toString().slice(-2)

                break

            case 'H': // 24-hour format of an hour with leading zeros (00 to 23)

                string += (h < 10) ? "0" + h : h

                break

            case 'g': // 12-hour format of an hour without leading zeros (1 to 12)

                hour = (h === 0) ? 12 : h

                string += (hour > 12) ? hour - 12 : hour

                break

            case 'h': // 12-hour format of an hour with leading zeros (01 to 12)

                hour = (h === 0) ? 12 : h

                hour = (hour > 12) ? hour - 12 : hour

                string += (hour < 10) ? "0" + hour : hour

                break

            case 'a': // Lowercase Ante meridiem and Post meridiem (am or pm)

                string += (h < 12) ? "am" : "pm"

                break

            case 'i': // Minutes with leading zeros (00 to 59)

                string += (mi < 10) ? "0" + mi : mi

                break

            case 's': // Seconds, with leading zeros (00 to 59)

                string += (s < 10) ? "0" + s : s

                break

            case 'c': // ISO 8601 date (eg: 2012-11-20T18:05:54.944Z)

                string += date.toISOString()

                break

            default:

                string += format[i]

        }
    }

    return string

}

const toggleDevTools = () => {

    if (mainWindow) {

        if (mainWindow.isDevToolsOpened()) {

            mainWindow.webContents.closeDevTools()

        } else {

            mainWindow.webContents.openDevTools({
                mode: "detach"
            })

        }

    }

}

let setupTrayMenu = () => {

    tray = new Tray(isDev ? `${rootFolder}/public/favicon.ico` : `/build/favicon.ico`)

    let trayTemplate = [{
            id: "title",
            label: "Name"
        }, {
            id: "title-separator",
            type: "separator"
        }, {
            id: "minimise",
            label: "Minimise",
            click() {

                if (mainWindow) {

                    mainWindow.minimize()

                }

                if (trayMenu) {

                    trayMenu.getMenuItemById("minimise").visible = false

                    trayMenu.getMenuItemById("maximise").visible = true

                }

            }
        }, {
            id: "maximise",
            label: "Maximise",
            visible: false,
            click() {

                if (mainWindow) {

                    mainWindow.restore()

                }

                if (trayMenu) {

                    trayMenu.getMenuItemById("minimise").visible = true

                    trayMenu.getMenuItemById("maximise").visible = false

                }

            }
        }, {
            label: "Open Root Directory",
            accelerator: "CmdOrCtrl+D",
            click() {

                shell.openExternal(rootFolder)

            }
        },
        {
            label: "Open / Close Dev Tools",
            accelerator: "CmdOrCtrl+Shift+I",
            click() {

                toggleDevTools()

            }
        }, {
            label: "Restart App",
            accelerator: "CmdOrCtrl+R",
            click() {

                app.relaunch()

                app.exit()

            }
        }, {
            label: "Quit App",
            accelerator: "CmdOrCtrl+Q",
            role: "quit"
        }, {
            label: 'Contact',
            click() {

                shell.openExternal('https://dbpixelhouse.com/contact')

            }
        }
    ]



    trayMenu = Menu.buildFromTemplate(trayTemplate)

    tray.setToolTip(app.getName())

    tray.setContextMenu(trayMenu)

}

let setupMainMenu = () => {

    let menuTemplate = [{
        label: 'Tools',
        submenu: [{
            role: 'reload'
        }, {
            role: 'forcereload'
        }, {
            role: 'toggledevtools'
        }]
    }, {
        role: 'window',
        submenu: [{
            role: 'minimize'
        }, {
            role: 'close'
        }]
    }, {
        role: 'help',
        submenu: [{
            label: 'Contact',
            click() {

                shell.openExternal('https://dbpixelhouse.com/contact')

            }
        }]
    }]

    applicationMenu = Menu.buildFromTemplate(menuTemplate)

    Menu.setApplicationMenu(applicationMenu)
}

//#endregion

//#region Window Managment

let createWindow = callback => {

    mainWindow = new BrowserWindow(Object.assign({
            movable: false,
            show: false,
            resizable: false,
            title: app.getName(),
            frame: false,
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                plugins: true
            }
        },
        process.platform == "darwin" ? {
            fullscreen: true,
            simpleFullscreen: true
        } : {}))

    mainWindow.loadURL(
        isDev ?
        "http://localhost:3000" :
        `file://${path.join(__dirname, "../build/index.html")}`
    )

    if (typeof (callback) === "function") callback()

}

//#endregion

//#region App Lifecycle

//Temporary fix for Electron Windows Scaling
app.commandLine.appendSwitch('high-dpi-support', 'true')
app.commandLine.appendSwitch('force-device-scale-factor', '1')

//Fix videos not autoplaying
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

app.on("ready", () => {

    x = electron.screen.getCursorScreenPoint().x

    y = electron.screen.getCursorScreenPoint().y

    currentScreen = electron.screen.getDisplayNearestPoint({
        x,
        y
    })

    createWindow(() => {

        setupCommunication()

        if (process.platform === "darwin") {

            setupMainMenu()

        } else {

            // setupTrayMenu()

        }

        if (isDev) {

            installExtension(REACT_DEVELOPER_TOOLS)
                .then((name) => console.log(`Added Extension:  ${name}`))
                .catch((err) => console.log('An error occurred: ', err));

            installExtension(REDUX_DEVTOOLS)
                .then((name) => console.log(`Added Extension:  ${name}`))
                .catch((err) => console.log('An error occurred: ', err));

        }


        mainWindow.once("closed", () => {

            mainWindow = null

        })

        mainWindow.once("ready-to-show", () => {

            mainWindow.setSize(currentScreen.size.width, currentScreen.size.height)

            mainWindow.setPosition(currentScreen.bounds.x, currentScreen.bounds.y)

            mainWindow.center()

            mainWindow.show()

            if (process.platform !== "darwin") {

                mainWindow.setKiosk(true)

            }

        })
    })
})


app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {

        app.quit()

    }

})

app.on("activate", () => {

    if (mainWindow === null) {

        createWindow()

    }

})

//#endregion