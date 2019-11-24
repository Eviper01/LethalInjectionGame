import signal
def interrupted(signum, frame):
    print( "Timeout!")
signal.signal(signal.SIGALRM, interrupted)
signal.alarm(5)
try:
    s = input("::>")
except:
    print( "You are interrupted.")
signal.alarm(0)
