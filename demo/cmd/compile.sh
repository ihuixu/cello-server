#!/bin/bash 
rf=$(pwd)'/'

script_path=`dirname $(pwd)`
script_path=${script_path##*/}

compile(){
	logf='/tmp/log/cello-compile/'` date +%Y/%m/` 
	log=$logf`date +%d`'.log'
	mkdir -p $logf
	echo 'compile static files'
	cd $rf'../' && node compile.js >> $log &
}

compile	

