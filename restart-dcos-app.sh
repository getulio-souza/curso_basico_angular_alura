#!/bin/sh

#app = 1 ="dev/health/services/api-order"
echo "restarting $1"

o=$(curl --location --request POST 'http://master.cloud.evolutix.com.br/acs/api/v1/auth/login' \--header 'Content-Type: application/json' \--data-raw '{"uid": "gitlab", "password": "naRGerpIev"}')

t=$(echo $o | grep -o '"token": *"[^"]*"' | grep -o '"[^"]*"$' | cut -d \" -f 2)

curl -X POST -H "Authorization: token=$t" http://master.cloud.evolutix.com.br/marathon/v2/apps/$1/restart