//Lethal Injection Hacking Game client

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const EventEmitter = require("events");
const emitter = new EventEmitter();


server.listen(25444, function () {

  init_database();
  Create_AI("whois");
  Create_AI("Contract-Broker");
  generate_bank()
  data.players["Contract-Broker"].index = function() {return ["Currently we dont offer contracts", global_dispatcher]}
  data.players.whois.index = function() {return ["Welcome to the Whois, Registered ip:\n CommSecAuto-Banking \n Contract-Broker" , global_dispatcher]}
  console.log("server running on 25444");
});
//helper functions

function random_normal(mean,stdev,samples){
  b = mean + Math.sqrt(3*samples)*stdev ;
  a = mean - Math.sqrt(3*samples)*stdev;
  sample_mean = 0
  for(var i=0; i < samples; i++){
      sample = (Math.random()*(b-a)) + a
      sample_mean += sample
  };
  if (sample_mean/samples < 0) {
    return random_normal(mean,stdev,samples)
  }
  else {
    return Math.floor(sample_mean/samples)
  }
};

//backend init - note dispatcher system could be used to send custom errors
var global_dispatcher = {  "help":"help",
                            "logs":"logs",
                            "ip":"ip",
                            "connect":"connect",
                            "disconnect":"disconnect",
                            "clearlogs":"clear_logs",
                            "editlogs": "edit_logs",
                            "index":"index",
                            "run":"run",
                            "data":"control_data"}
var data = {};
function init_database() {
  data["players"] = {};
  data["global"] = {bankaccounts: {}};
  data["missions"] = {}
};
function Create_AI(ip) {
  AI = {
  ip: ip,
  type:"AI",
  log: [],
  virus: [],
  index: function() {
    //this is gonna need to be a core gamplay design
    return ["/", global_dispatcher]

  },
  print_log: function() {
      out = "*****"
      for (x in this.log) {
          out = out + "\n" + this.log[x];
      }
      return out
    },
  clear_log: function() {
    this.log = [];
  },
  edit_log: function(message) {
    data.players[this.connection].log.push(message);
  },
  alert: function() {},
  };
  data.players[ip] = AI;
  };

function generate_bank() {
  Create_AI("CommSecAuto-Banking");
  data.players["CommSecAuto-Banking"].index = function() {return ["Welcome To CommSec: \nlogin\nregister ", {help:"bank_help", login:"bank_login", register:"bank_register","cancel":"global_cancel"}]}

};

//Contract Broker methods
function Generate_Robbery_Mission() {
  target = Generate_Random_AI_Bank_Account();
  //add this to the database of missions
  //create somekind of listner that pays out the owner of the connctract when the account is emptied
}
function Generate_Transfer_Mission() {
  //create two accounts
  //fire success when account is empty
}

function Generate_Random_AI_Bank_Account() {
  balance = random_normal(1000,300,1000);
  account_name = Math.floor(Math.random()*100000000);
  data.global.bankaccounts[account_name] = balance;
  reward = random_normal(1200,250,1000);
  return account_name
}


//Also how about attacks being depended on ports opened by actions the victim makes

// client will diplay info when passed -->   socket.emit("broadcast",info);
io.on('connect', function(socket) {
  console.log("connection received :" + socket.id);
  socket.on('new_player', function(input){
      player = {
      ip: socket.id,
      connection: socket.id,
      permission: "root",
      log: [],
      files: {
        rootkit: function(ip_in) {
          socket.emit("broadcast", "running rootkit")
          setTimeout(function() {data.players[ip_in].permission = "root";
          socket.emit("broadcast","success");
          data.players[data.players[ip_in].connection].log.push(ip_in + " logged in as root");
        },3000);
        },
        netscan: function(ip_in) {
          connected = data.players[ip_in].connection
          socket.emit("Initialising Scan...");
          const entries = Object.entries(data.players);
          var pwned = [];
          for (x in entries){
            if (entries[x][1].connection == connected) {
              pwned.push(entries[x][0]);
            }
          }
          setTimeout(function () {
              for (x in pwned) {
                data.players[pwned[x]].alert("Netscan on Connected node showed " + pwned.length + " connections")
                data.players[pwned[x]].alert("Atempting to trace connections....")}
                pwned = []
                setTimeout(function () {
                  for (x in entries){
                    if (entries[x][1].connection == connected) {
                      pwned.push(entries[x][0]);
                    }
                  }
                  socket.emit("broadcast", "Trace Found:")
                  for (x in pwned){
                    socket.emit("broadcast",pwned[x])
                  }
                }, 4000);
          }, 1000);

        },
        ecm_overdrive: function(ip_in) {
          socket.emit("broadcast", "running jamming attack on connected host")
          attack = setInterval(function () {
            var result           = '';
            var characters       = 'ABCDEF GHIJKLMNOPQRSTUVWXYZ a bcd efgh ijkl mnop qrstu vwxyz 0123456789!@#$%^&*()_+-=/<>:"{}"';
            var charactersLength = characters.length;
            for ( var k = 0; k < random_normal(300,25,250); k++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            data.players[data.players[ip_in].connection].alert(result)
          }, 10);
          setTimeout(function () {
            clearInterval(attack);
          }, 1000);
          data.players[data.players[ip_in].connection].disconnect();
        }
      },
      virus: [],
      print_log: function() {
          out = "*****"
          for (x in this.log) {
              out = out + "\n" + this.log[x];
          }
          return out
        },
      clear_log: function() {
        this.log = [];
      },
      disconnect: function() {
        this.connection = this.ip;
        this.permission = "root"
      },
      connect: function(ip_address) {
        this.connection = ip_address;
        this.permission = "user"
        data.players[this.connection].log.push(this.ip + " connected at: " + new Date().toISOString());
      },
      edit_log: function(message) {
        data.players[this.connection].log.push(message);
      },
      alert: function(message) {
        socket.emit("broadcast",message);
      }
    };
    data.players[socket.id] = player;
    console.log(data);
    socket.emit("Get_Input",global_dispatcher);
  });

  socket.on('help', function(input){
    var info = "Git Good";
    socket.emit("broadcast", info);
    socket.emit("Get_Input",global_dispatcher);
  });
  socket.on('logs', function(input){
    socket.emit("broadcast", "Printing Logs...");
    socket.emit("broadcast", data.players[data.players[socket.id].connection].print_log());
    socket.emit("Get_Input",global_dispatcher);
  });
  socket.on('clear_logs', function(input){
    socket.emit("broadcast", "Clearing Logs");
    setTimeout(function() {data.players[data.players[socket.id].connection].clear_log();
                          socket.emit("broadcast", "success");
                          socket.emit("Get_Input",global_dispatcher);},1500);


  });
  socket.on('edit_logs', function(input){
    socket.emit("broadcast", "Editing Logs...");
    setTimeout(function() {data.players[socket.id].edit_log(input.argument);
                          socket.emit("broadcast", "success");
                          socket.emit("Get_Input",global_dispatcher);},3000);

  });
  socket.on('connect', function(input){
    try {
    socket.emit("broadcast", "Connected to: " + input.argument);
    data.players[socket.id].connect(input.argument);
    data.players[socket.id].log.push("connected to: " + data.players[socket.id].connection + " at " + new Date().toISOString());
    socket.emit("Get_Input",global_dispatcher);}
    catch {
      socket.emit("broadcast", "404 Error: Server did not respond");
      data.players[socket.id].connection = data.players[socket.id].ip;
      socket.emit("Get_Input",global_dispatcher);
    }
  });
  socket.on('disconnect', function(input){
    socket.emit("broadcast", "Disconnecting...");
    setTimeout(function() {data.players[socket.id].disconnect();
                          socket.emit("broadcast", "Diconnected")
                          socket.emit("Get_Input",global_dispatcher);},1500);

  });

  socket.on('index', function(input){
    try {
    page_file = data.players[data.players[socket.id].connection].index();
    socket.emit("broadcast", page_file[0]);
    socket.emit("Get_Input",page_file[1]);}
    catch {
      socket.emit("broadcast", "404 Error: Server rejected connection");
      socket.emit("Get_Input",global_dispatcher);}
  });
  socket.on('ip', function(input){
    socket.emit("broadcast", data.players[socket.id].connection + " as " + data.players[socket.id].permission);
    socket.emit("Get_Input",global_dispatcher);
  });
  socket.on('run', function(input){
    try {
      //this might need to be reenginnered
    data.players[socket.id].files[input.argument](socket.id);
    socket.emit("Get_Input",global_dispatcher);} ///this input request is a little bit wacky
     catch {
      socket.emit("broadcast","Unknown Program");
      socket.emit("Get_Input",global_dispatcher);
   }
  });

//specific functions for certain AI
// necessary to prevent soft loops
socket.on("global_cancel", function(input){
  socket.emit("broadcast", "Operation Canceled");
  socket.emit("Get_Input", global_dispatcher);
});


//Banking Functions

  socket.on("bank_login", function(input) {
    if (Object.keys(data.global.bankaccounts).includes(input.argument)) {
    data.players[socket.id].logged_bank_account = input.argument
    socket.emit("broadcast","Logged into: " + input.argument)
    socket.emit("broadcast", "account has balance: $" + data.global.bankaccounts[input.argument])
    data.players["CommSecAuto-Banking"].log.push(socket.id + " logged into account: " + input.argument)
    data.players[socket.id].log.push(socket.id + " logged into account: " + input.argument)
    socket.emit("broadcast", "Type transfer and an account number to initiate transfer")
    socket.emit("Get_Input", {"transfer":"bank_transfer","cancel":"global_cancel"});

  }
  else {
    socket.emit("broadcast", "invalid account number");
    socket.emit("Get_Input",{help:"bank_help", login:"bank_login", register:"bank_register","cancel":"global_cancel"});
  }
  });
  socket.on("bank_transfer", function(input) {
    if (Object.keys(data.global.bankaccounts).includes(input.argument)) {
    var transfer_amount = data.global.bankaccounts[data.players[socket.id].logged_bank_account]
    data.global.bankaccounts[input.argument] += data.global.bankaccounts[data.players[socket.id].logged_bank_account]
    socket.emit("broadcast","Transfered $" + transfer_amount + " from " + data.players[socket.id].logged_bank_account + " to " + input.argument)
    data.players["CommSecAuto-Banking"].log.push(socket.id + " Transfered $" + transfer_amount + " from " + data.players[socket.id].logged_bank_account + " to " + input.argument)
    data.players[socket.id].log.push("Transfered $" + transfer_amount + " from " + data.players[socket.id].logged_bank_account + " to " + input.argument)
    data.global.bankaccounts[data.players[socket.id].logged_bank_account] = 0
    socket.emit("Get_Input", global_dispatcher);
  }
  else {
    socket.emit("broadcast", "invalid account number: try a different account number");
    socket.emit("Get_Input", {"transfer":"bank_transfer","cancel":"global_cancel"});
  }
  });
  socket.on("bank_help", function() {
    socket.emit("broadcast", "\nlogin\nregister")
    page_file = data.players[data.players[socket.id].connection].index();
    socket.emit("broadcast", page_file[0]);
    socket.emit("Get_Input",page_file[1]);
  });
  socket.on("bank_register", function() {
    account_name = Math.floor(Math.random()*100000000);
    data.global.bankaccounts[account_name] = 0;
    socket.emit("broadcast","created account: " + account_name + "\nit is highly recommended that you save this number keep it private");
    socket.emit("Get_Input",global_dispatcher);
  });
//server control functions - this probably needs some kind of authentication or something cause otherwise this might be the big bad
//also once functions can occure once per contorl connection which might do some weird shit --> yep it does do wierd shit so this could be problematic
  socket.on('control_data', function(input){
    console.log(data);
    socket.emit("Get_Input",global_dispatcher);
  });

});

//List of Hackertools
