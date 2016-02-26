#!/bin/bash
if [ $USER != "work" ]
then
	echo "work only"
##  exit 1
fi
source ~/.bash_profile

rf=$(pwd)'/'

updateVersion() {
	echo 'UPDATE VERSION'
	cd $rf'jserver/' && node version.js
}


if [ $# -eq 0 ];then
	echo "you should pass args version"
else
	case $1 in
		"version")
			updateVersion	
			;;
	esac
fi
