'use strict'
const pg = require('pg');
const mysql = require('mysql');

/**
  Database communication and functionality
**/
module.exports = class DatabaseHandler {
  //const DBURL = process.env.DATABASE_URL || "postgres://eehwvfixxiwamp:55d64c3b425aebf6fce5678970cef00d3293df5896d7f43fbad2059297a979c8@ec2-79-125-4-72.eu-west-1.compute.amazonaws.com:5432/df34h992q2uhdj"
  constructor() {
    console.log("DatabaseHandler constructor")
    this.con;
    this.date = new Date();
    this.establishConnection();
  }

  establishConnection() {
    this.con = new pg.Client({
      host: 'ec2-79-125-4-72.eu-west-1.compute.amazonaws.com',
      user: 'eehwvfixxiwamp',
      database: 'df34h992q2uhdj',
      password: '55d64c3b425aebf6fce5678970cef00d3293df5896d7f43fbad2059297a979c8',
      port: 5432,
      ssl: true
    });

    this.con.connect(function(err) {
      if (err) return console.log(err);
      else {
        console.log("CONNECTED TO DB");
      }
    });
  }

  getGrades(socket) {
    //Get Grades from DB when client first opens the webapplication
    console.log("retrieveGradesFromDB");
    var grades = [];
    var today = this.date.toISOString().substring(0, 10);

    const query = {
      text: 'SELECT * FROM grades WHERE date_pk = $1',
      values: ["2019-03-22"],
    }
    // callback
    this.con.query(query, (err, res) => {
      console.log("query");
      if (err) {
        return console.log(err.stack);
      } else {
        for (var i = 1; i < res.fields.length; i++) {
            var fieldName = res.fields[i].name;
            var grade = new Array();
            grade[0] = fieldName;
            grade[1] = res.rows[0][fieldName];
            grades.push(grade);
        }
      }
      console.log(grades);
      socket.emit('grades', grades);
    })
  }

  addVote(typeOfVote) {
    //+1 vote to grades when someone press on of the buttons
  }

  insertFood() {
    //Insert a new row in the food Database each day to get the meal
    //Get data from skolmaten api?
  }

  insertQuestions() {

  }
}
