#!/bin/bash

./mysql2sqlite.sh --default-character-set=UTF8 -u $1 -p"$2" kurancalis chapter verse footnote author translation | ./sqlite3 kurancalis.db