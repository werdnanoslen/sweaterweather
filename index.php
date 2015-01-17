<?php

try {
    $conn = new PDO (
    "sqlsrv:server = tcp:kn8snbwiz9.database.windows.net,1433; Database = sweaterweather",
    "sweaterweather",
    'jwBE!*BkQGsu!rzspQBCj9T$u5QWCjTY'
);
$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print("Error connecting to SQL Server.");
    die(print_r($e));
}

?>

Hello, world!
