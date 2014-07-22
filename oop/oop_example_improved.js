function Class(inheritedFrom, constructor, members){
	// Check if inheritance happened.
	if(typeof members === "undefined" ){
		members = constructor;
		constructor = inheritedFrom;
		inheritedFrom = null;
	}
	var newClass = constructor;
	if(inheritedFrom) newClass.prototype = Object.create( inheritedFrom.prototype );

	// Copy members to prototype.
	for(var p in members){
		newClass.prototype[p] = members[p];
	}
	return newClass;
}

//console.log('===== Class Person ==================');
var Person = Class(function (){
	console.log('Constructor: Person');
	this.name = "";
	this.birthday = "";
}, {
	getName: function(){
		return this.name;
	},
	setName: function(name){
		this.name = name;
	},
	getBirthday: function(){
		return this.birthday;
	},
	setBirthday: function(birthday){
		this.birthday = birthday;
	},
	sayHello: function(){
		return this.name + " : " + this.birthday;
	}
});

//console.log('===== Class Student ==================');
var Student = Class(Person, function(){
	Person.call(this);
	console.log('Constructor: Student');
}, {
	sayHello: function(){
		return "I'm a student. " + this.name + " : " + this.birthday;
	}
});

//console.log('===== Class Teacher ==================');
var Teacher = Class(Person, function(){
	Person.call(this);
	console.log('Constructor: Teacher');
}, {
	sayHello: function(){
		return "I'm a teacher. " + this.name + " : " + this.birthday;
	}
});

//console.log('===== Class MathTeacher ==================');
var MathTeacher = Class(Teacher, function(){
	Teacher.call(this);
	console.log('Constructor: MathTeacher');
}, {
	sayHello: function(){
		return "I'm a math teacher. " + this.name + " : " + this.birthday;
	}
});

(function(){

var personsList = [];

console.log('===== Create Student 1 ==================');
var c1 = new Student;
personsList.push(c1);
c1.setName('John');
c1.setBirthday('2000/3/8');
console.log(c1.sayHello());

console.log('===== Create Student 2 ==================');
var c2 = new Student;
personsList.push(c2);
c2.setName('Mary');
c2.setBirthday('2000/10/30');
console.log(c2.sayHello());

console.log('===== Create Teacher 1 ==================');
var i1 = new Teacher;
personsList.push(i1);
i1.setName('Bill');
i1.setBirthday('1980/12/3');
console.log(i1.sayHello());

console.log('===== Create MathTeacher 2 ==================');
var i2 = new MathTeacher;
personsList.push(i2);
i2.setName('Gary');
i2.setBirthday('1970/1/22');
console.log(i2.sayHello());

console.log('===== Test polymorphism ==================');
for(var o in personsList){
	if( personsList[o] instanceof Person ){
		console.log(personsList[o].sayHello());
	}
}

})();
