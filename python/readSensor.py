import serial
import time
import fcntl

def is_serial_port_free(serial_port):
    try:
        
        # Try to acquire an exclusive lock on the port
        fcntl.flock(serial_port.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        
        # If successful, the port is not busy
        return True
    except (serial.SerialException, OSError) as e:
        # Port is busy or cannot be opened
        return False
    finally:
        # Close the serial port to release the resources
        if 'serial_port' in locals() and serial_port.is_open:
            serial_port.close()


ser=serial.Serial('/dev/ttyACM0', 115200, timeout=0)
# is_serial_port_free(ser)
while True:
    x=ser.readline()
    b = ser.readline()
    try:
        string = x.decode('ascii')
    except Exception:
        string =  "0 0 0 0 0 0"

    print(string)

    time.sleep(0.1)
