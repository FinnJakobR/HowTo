#!/bin/bash

30 0 * * * npm stop && echo "HowTo has Stopped"
33 0 * * * npm start && echo "HowTo has Restarted"