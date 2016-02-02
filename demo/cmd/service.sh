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
	logf=$rf'../log/server/'` date +%Y/%m/` 
	log=$logf`date +%d`'.log'
	echo 'SERVICE START AT '` date +%Y/%m/%d-%T` >> $log
	mkdir -p $logf
	echo 'static service start , logfile:'$log	
	cd $rf'../' && nohup node server.js >> $log &

}
compile(){
	logf=$rf'../log/compile/'` date +%Y/%m/` 
	log=$logf`date +%d`'.log'
	mkdir -p $logf
	echo 'compile static files'
	cd $rf'../' && node compile.js >> $log &
	tail -f $log
}

if [ $# -eq 0 ];then
	echo "you should pass args start|restart|stop"	
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
		"compile") 
			compile	
			;;
	esac
fi	

