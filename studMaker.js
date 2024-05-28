"use-strict";
const prompt = require("prompt-sync")();
const fs = require('fs');

const FILE_PATH = 'students.json';

// student maker
function Student(name, surname, grade) {
    this.name = name;
    this.surname = surname;
    this.grade = grade;
}

// set toString to the prototype of student maker
Student.prototype.toString = function () {
    return `${this.name} ${this.surname} (grade: ${this.grade})`;
}

// save students to a file
const saveStudents = (students) => {
    const data = JSON.stringify(students, null, 2);
    fs.writeFileSync(FILE_PATH, data);
}

// load students from file
const loadStudents = () => {
    if (fs.existsSync(FILE_PATH)) {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        if (data) { // Check if the file is not empty
            try {
                const students = JSON.parse(data);
                // Ensure each object is a Student instance with grade as a number
                return students.map(s => new Student(s.name, s.surname, parseFloat(s.grade)));
            } catch (err) {
                console.error("Error parsing JSON data:", err);
                return [];
            }
        }
    }
    return [];
}

// student maker for the user
const studentMaker = (students) => {
    console.clear();
    while (true) {
        let studName = prompt("Name: ");
        if (studName === "`" || studName === "") {
            break;
        }
        let studSur = prompt("Surname: ");
        if (studSur === "`" || studSur === "") {
            break;
        }
        let grad = prompt("Grade: ");
        if (grad === "`" || grad === "") {
            break;
        }
        let stud = new Student(studName, studSur, parseFloat(grad));
        students.push(stud);
    }
    return students;
}


// the average of the grades
const average = (students) => {
    console.clear();
    if (students.length === 0) {
        console.log("No students to calculate the average grade.");
        return;
    }
    let totalGrades = 0;
    students.forEach(student => {
        totalGrades += student.grade;
    });
    let avgGrade = totalGrades / students.length;
    console.log(`The average is: ${avgGrade.toFixed(2)}`);
}

const sortGrades = (students) => {
    console.clear();
    const sortBy = parseInt(prompt('How you want to sort the students?\n1. by name, 2. by surname, 3. by grade\n'));
    console.clear();
    switch(sortBy) {
        case 1:
            students.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 2:
            students.sort((a, b) => a.surname.localeCompare(b.surname));
            break;
        case 3:
            students.sort((a, b) => a.grade - b.grade);
            break;
        default:
            console.log("Invalid option! Sorting by name.");
            students.sort((a, b) => a.name.localeCompare(b.name));
    }
    console.log(students.map(student => student.toString()).join('\n'));
}
// delete all students
const deleteStuds = (students) => {
    while (students.length) {
        students.pop();
    }
    console.clear();

}
// show specific student
const showStudent = (students) => {
    console.clear();
    console.log(students.map((student, index) => `${index + 1}. ${student.toString()}`).join('\n'));
    let ch = parseInt(prompt("Enter the number of the student you want to view: "));
    if (ch > 0 && ch <= students.length) {
        console.clear();
        console.log(students[ch - 1].toString());
        let remove = prompt("Do you want to remove current student (y/n)?");
        if(remove == 'y'){
            removeStud(students,ch);
        }
    } else {
        console.log("Invalid student number.");
    }

}

// remove student
const removeStud = (students, index) => {
    if (index > 0 && index <= students.length) {
        students.splice(index - 1, 1);
        console.clear();
        console.log("Student removed successfully.");
    } else {
        console.log("Invalid student number.");
    }
}

// Show All Students
const showAllStudents = (students) => {
    console.log(students.map(student => student.toString()).join('\n'));
}

// main program
let students = loadStudents();
if (students.length === 0) {
    console.clear();
    console.log("No students yet!");
} else {
    console.clear();
    console.log(`Loaded students:\n${students.map(student => student.toString()).join('\n')}`);

}

let ch;

do {
    console.log(`What you wanna do next?`);
    console.log("\n");
    ch = parseInt(prompt(`1. Enter new student\n2. Delete all students\n3. Show average\n4. Show specific student\n5. Show all students\n6. Sort students\n7. Close app!`));

    switch (ch) {
        case 1:
            studentMaker(students);
            break;
        case 2:
            deleteStuds(students);
            console.log("All students have been deleted.");
            break;
        case 3:
            average(students);
            break;
        case 4:
            showStudent(students);
            break;
        case 5:
            console.clear();
            showAllStudents(students);
            break;
        case 6:
            sortGrades(students);
            break;
        case 7:
            saveStudents(students);
            console.clear();
            console.log('Students Saved! Closing the app!!');
            break;
        default:
            console.log("Make a valid choise!");
    }

} while (ch !== 7);

