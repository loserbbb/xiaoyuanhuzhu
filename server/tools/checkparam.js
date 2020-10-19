
var handle = {
  realName:function(value){
    if(typeof(value)!='string'){
      return false
    }
    if(value.length<2&&value.length>12){
      return false
    }
    return true
  },
  phoneNumber:function(value){
    if (typeof (value) != 'string') {
      return false
    }
    if (value.length != 11) {
      return false
    }
    return true
  },
  openId:function(value){
    if (typeof (value) != 'string') {
      return false
    }
    if (value.length != 28) {
      return false
    }
    return true
  },
	sex:function(value){
		if(typeof(value)!='string'){
			return false
		}
		if (value != '0' && value != '1'){
			return false
		}
		return true
	},
	publisher:function(value){
		if (typeof (value) != 'string') {
			return false
		}
		if (value.length != 28) {
			return false
		}
		return true
	},
	reward:function(value){
		if(isNaN(parseInt(value))){
			return false
		}
		return true
	},
	title:function(value){
		if(typeof(value)!='string'){
			return false
		}
		if(value.length <3 || value.length > 15){
			return false
		}
		return true
	},
	discription: function (value) {
		if (typeof(value) != 'string') {
			return false
		}
		if (value.length < 3 || value.length > 150) {
			return false
		}
		return true
	},
	location: function(value) {
		if(typeof(value) != "object"){
			return false
		}
		if(typeof(value.latitude) != 'number' || typeof(value.longitude) != 'number'){
			return false
		}
		return true
	},
	picture:function(value){
		if(typeof(value) != 'object'){
			return false
		}
		return true
	},
	content:function(value){
		if(typeof(value) != 'string'){
			return false
		}
		if(value.length < 1 || value.length > 150){
			return false
		}
		return true
	}
}


module.exports = function(item){
  for(var k in item){
    if(item[k] == null){
      return false
    }
    if(!handle[k](item[k])){
      return false
    }
  }
  return true
}

