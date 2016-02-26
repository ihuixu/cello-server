#!/bin/bash 
rf=$(pwd)'/'

script_path=`dirname $(pwd)`
script_path=${script_path##*/}

stopService() {
	echo 'stop server'
	if [ ! -f $rf'pids' ]; then
		for proc in `ps -ef | grep node | grep server.js | awk '{print $2}'`; do
			kill   $proc ; done
	else
		cat $rf'pids' | while read line; do
			#echo 'kill '$line ;
			kill $line
		done
		rm -r $rf'pids'
	fi 

	}
startService() {
	logf='/tmp/log/cello-server/'` date +%Y/%m/` 
	log=$logf`date +%d`'.log'
	echo 'SERVICE START AT '` date +%Y/%m/%d-%T` >> $log
	mkdir -p $logf
	echo 'static service start , logfile:'$log	
	cd $rf'../' && nohup node server.js >> $log &

}
updateVersion() {
	echo 'UPDATE VERSION'
	cd $rf'../' && node version.js

}


if [ $# -eq 0 ];then
	echo "you should pass args start|restart|stop|version"	
else
	case $1 in
		"stop") 
			stopService
			;;
		"start") 
			startService
			;;
		"restart") 
			stopService
			startService
			;;
		"version") 
			stopService
			updateVersion
			startService
			;;
	esac
fi	

