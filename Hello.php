<?php
if (isset($argc)) {
	for ($i = 1; $i < $argc; $i++) {
		echo "Hello " . $argv[$i] . "!\n";
	}
} else {
	echo "argc and argv disabled!\n";
}
?>