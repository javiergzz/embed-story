/*global angular $*/
angular.module("livepost")
.constant('SETTINGS', {
    hostSelected: 'local',
    hosts: {
        devl: {
            apiProtocol: 'http',
            apiHost: 'livepost.co',
            apiPort: ''
        },
        prod: {
            apiProtocol: 'https',
            apiHost: 'livepost.co',
            apiPort: ''
        },
        local: {
            apiProtocol: 'http',
            apiHost: 'localhost',
            apiPort: '65110'
        }
    }
})
.constant('DIR', {
    hostSelected: 'http://10.79.10.122:8014/'
})
.constant('STRING', {
  EMPTY : "",
  NOT_FOUND : -1,
  SPACE : " "
})
.constant('USER_ROLES', {
  all: '*',
  guest: 'guest'
})
.constant('PUSH', {
  access : {
    login : "frank",
    password : "trustfrank"
  },
  key : {
    prod : 'CTttWWjtZ1NbSuLm1eIhd35XpwDJURSg',
    dev : 'VJeW66rHkvsIpUMNmZEZvdXR6NZdz0Xw',
    selected : 'VJeW66rHkvsIpUMNmZEZvdXR6NZdz0Xw'
  }
})
.constant('DIR_CLOUD', {
  hostSelected :  'https://api.cloud.appcelerator.com/v1/'
});