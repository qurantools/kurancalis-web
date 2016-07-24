#!/bin/bash
rm kurancalis.db
./mysql2sqlite.sh --default-character-set=UTF8 -u $1 -p"$2" kurancalis chapter verse footnote author translation | ./sqlite3 kurancalis.db
count=`mysql -u$1 -p"$2" -e "select count(*) from translation" kurancalis | grep "\d"`
sed -i "s/translationTableCount.*/translationTableCount': $count/" assets/js/config.js