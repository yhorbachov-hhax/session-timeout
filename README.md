# Session Timeout POC

For run the application

```
    npx http-server
```


## Overview

### Requirements
There need to create a reusable solution for tracking user activity and react to inactivity by showing or changing UI accordingly

### Main issues: 
#### Multi-app timer sync:
We have a different environments where applications will be used, each application will provide own solution for tracking inactivity. In most cases, it is simple background process which will check latest time of activity in a certain interval manner. When user will open multiple applications, there will be multiple collateral running processes, where no one know existence of each other. From this basis, we need to resolve and consolidate background processes and propagate any changes to every active application

#### Multi-app UI reactions:
We have a multiple applications where user activity on track and application should react to his activity, either update timer or show a corresponding message. The issue is that we don't have way to define where to show it. When user can jump between two or three windows we definitely need to show him a system updates on the right window, where he actually operates. From this basis, we need to provide a mechanism which will track user activity and will show system messages for a right window

#### Not covered issues: 
Activity Tracker: Session Timeout feature could be defined as: modular lightweight background process which reactively tracks user activity. At the point of "activity" we could substitute a lot of actions: mouse scroll, page navigation, focusing by keyboard or go to offline. At the current case, example not provides a way about how to manage and handle those activities, there should be another POC with proper investigation 

### File Structure
```
js/ -
    alert-timeout.js - main functionality, combine all other js files
    constants.js - default values, such as event keys, mostly used for alert-timeout 
    utils.js - helpers, used as for alert-timeout and directly at html for examples itself

application-a.html - child application, can propagate event those can be handled by main.html, also listens events from main 
application-b.html - same as application a, but with different event names
main.html - main gateway, can open other applications, contains info about status and placeholders for event examples. 
index.html - root application, only used for hosting main file within iframe
```

The `application-a|b` and `main` are includes all js files, that mean they support timeout functionality  

## Technical Overview

### alert-timeout
There are a few main functions what we can document:
- listenTimeoutAtBackground
- listenApplicationEvents
- listenWindowFocus

#### listenTimeoutAtBackground
The core functionality. This is background interval process, which will one main routine. 
Here we have two required checks: is this focused window and is warning activity message should be shown. Check about focused window is highly related to `listenWindowFocus` functionality, when check about activity is related to `checkIsWarningActivity` and `checkIsExpiredActivity`. Main idea for routine here is check validity of window and timer, in both positive results show the message, based on the response from the user to this message, there will either refresh or expiration, both of them with notification up to main window

#### listenApplicationEvents
The event functionality. There are two background processes which listens Refresh and Expire events from other applications. Other applications will emit events from `listenTimeoutAtBackground` or just when this script starts ups on the page. At the current implementation expire and refresh just nullify or update local variable.  

#### listenWindowFocus
The focus tracker functionality. This is simple assignment of loaded window to main window scope. We could split this function into two segments: Listen current window focus events and update `focusedWindow` reference and initial update for this property. Focused window property assignment encapsulated within utils, where value just patched global accessed value 

#### checkIsWarningActivity and checkIsExpiredActivity
The activity check functionality. Example of possible tracking time of user activity. Initially invoked on file load and on following up `listenTimeoutAtBackground` invocations.
At the current implementation just takes current time and subtracts from last updated time, either it in range of warning message or expiration status 

### constants

There are listed main constants, such as event names and timer checkpoints

### utils

There are listed main helper functions, such as getTopWindow, get/setCurrentFocusedWindow, patchEvent and listenEvent

#### getTopWindow
Top window locator functionality. In case of endless nesting and multi window applications, we need to keep application state at one place and the most top window is a convenient place to manage applications globals. This utils additionally checked opener for child windowed environment

## Demo
TODO