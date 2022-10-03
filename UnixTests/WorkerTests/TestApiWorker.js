const { fork } = require("child_process");

function TestParameterInWorker(parameter) {
    const Api_process = new fork("../../Workers/ApiWorker.js", [parameter]);
}

TestParameterInWorker(JSON.stringify({ "HA": 2 }));