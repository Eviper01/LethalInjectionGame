import socketio
try:
    ip = open("server.txt", "r")
    io = socketio.Client()
    @io.event
    def connect():
        print('**connection established**')
        io.emit("new_player")
    @io.event
    def disconnect():
        print('disconnected from server')
        exit()
    @io.event
    def broadcast(info):
        print(info)
    @io.event
    #might want to add client side help like: --> if help --> list dispatcher --> call Get_Input(dispatcher)
    def Get_Input(dispatcher):
        command = input()
        instruction = command.partition(' ')[0]
        try:
            argument = command.partition(' ')[2]
        except IndexError:
            argument = 0
        try:
            io.emit(dispatcher[instruction], {"argument":argument})
        except KeyError:
            print("Invalid Input")
            Get_Input(dispatcher)

    io.connect(ip.read())
    io.wait()
except:
    print("error")
    io.disconnect()
