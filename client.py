import socketio
index_dispatcher = None
print("imported")
io = socketio.Client()
@io.event
def connect():
    print('**connection established**')
    io.emit("new_player")
    while True:
        command = Get_input()
        try:
            io.emit(command[0], {"argument":command[1]})
        except:
            pass
@io.event
def disconnect():
    print('disconnected from server')
    exit()
@io.event
def broadcast(info):
    print(info)
@io.event
def inputer(dispatcher):
    global index_dispatcher
    index_dispatcher = dispatcher

#this is probably better done with a dispatcher = {list of comands}

def Get_input():
    global index_dispatcher
    dispatcher = {  "help":"help",
                    "logs":"logs",
                    "ip":"ip",
                    "connect":"connect",
                    "disconnect":"disconnect",
                    "clearlogs":"clear_logs",
                    "editlogs": "edit_logs",
                    "index":"index",
                    "run":"run",
                    "data":"control_data"}
    command = input()
    instruction = command.partition(' ')[0]
    try:
        argument = command.partition(' ')[2]
    except IndexError:
        argument = 0
    if index_dispatcher != None:
        try:
            io.emit(index_dispatcher[instruction], {"argument":argument})
        except KeyError:
            print("Invalid Request, Exiting Index")
        index_dispatcher = None
    else:
        try:
            return [dispatcher[instruction], argument]
        except KeyError:
            print("Unknown Command")
            return Get_input()

io.connect("http://localhost:25444")
