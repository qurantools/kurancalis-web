#!/bin/bash

./mysql2sqlite.sh --default-character-set=UTF8 -u kurancalis -p"$1" kurancalis chapter verse footnote author translation | ./sqlite3 database.sqlite