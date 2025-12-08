import socket
import sys

# Buffer size for reading chunks of data, especially the length prefix
CHUNK_SIZE = 1024


def read_until_delimiter(sock: socket.socket, delimiter: bytes) -> bytes | None:
    """
    Reads data from the socket until the specified delimiter (space) is found.
    This is necessary to determine the length prefix.
    """
    data = b''
    while not data.endswith(delimiter):
        try:
            chunk = sock.recv(1)  # Read byte by byte until space is found
            if not chunk:
                # Connection closed by server
                return None
            data += chunk
        except socket.error:
            return None
    return data


def receive_full_message(sock: socket.socket) -> str | None:
    """
    Receives a message based on the Text-Based Length Prefix Protocol (Length<space>Body).
    """
    try:
        # 1. Read byte by byte until the space (' ') delimiter is found
        raw_length_with_space = read_until_delimiter(sock, b' ')
        if raw_length_with_space is None:
            return None

        # 2. Separate length and content
        # raw_length_with_space now contains "Length " (e.g., b'15 ')
        raw_length = raw_length_with_space[:-1]  # Remove the trailing space

        # Convert the length string (bytes) to an integer
        message_length = int(raw_length.decode('utf-8'))

        # 3. Read the entire message body (the core content)
        full_data = b''
        while len(full_data) < message_length:
            remaining = message_length - len(full_data)
            data = sock.recv(min(CHUNK_SIZE, remaining))

            if not data:
                # Connection closed while reading body
                return None
            full_data += data

        return full_data.decode('utf-8')

    except ValueError:
        # Error converting length string to integer (corrupted data)
        return None
    except socket.error:
        # General socket error
        return None


def send_full_message(sock: socket.socket, message: str) -> bool:
    """
    Sends a message using the Text-Based Length Prefix Protocol (Length<space>Body).
    """
    try:
        encoded_message = message.encode('utf-8')
        message_length = len(encoded_message)

        # Create the prefix: "Length "
        prefix = f"{message_length} "
        encoded_prefix = prefix.encode('utf-8')

        # Send the combined prefix and data
        sock.sendall(encoded_prefix + encoded_message)
        return True
    except socket.error:
        return False


def run_client(server_ip: str, server_port: int):
    """
    Manages the connection and two-way communication with the TCP server.
    """
    s = None
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((server_ip, server_port))
    except Exception:
        return

    try:
        while True:
            msg = input()

            if not msg:
                continue

            if not send_full_message(s, msg):
                continue

            server_response = receive_full_message(s)

            if server_response is None:
                break

            print(server_response, end="")

    except EOFError:
        pass
    except Exception:
        pass

    finally:
        if s:
            s.close()


def main():
    if len(sys.argv) != 3:
        sys.exit(1)

    server_ip = sys.argv[1]

    try:
        server_port = int(sys.argv[2])
    except ValueError:
        sys.exit(1)

    run_client(server_ip, server_port)

if __name__ == "__main__":
    main()