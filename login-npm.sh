#!/usr/bin/env bash

USERNAME=$1
PASSWORD=$2
EMAIL=$3

/usr/bin/expect <<EOF
set timeout 10
spawn npm login --registry=http://nexus.alis.solutions/repository/npm-group/
match_max 100000

expect "Username"
send "$USERNAME\r"

expect "Password"
send "$PASSWORD\r"

expect "Email"
send "$EMAIL\r"

expect {
   timeout      exit 1
   expect eof
}
EOF
