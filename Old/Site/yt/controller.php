<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use YoutubeDl\Options;
use YoutubeDl\YoutubeDl;

$yt = new YoutubeDl();

 if ( !file_exists('downloads') ) {
     mkdir ('downloads', 0744);
 }

 $files = glob('downloads/*'); // get all file names
foreach($files as $file){ // iterate files
  if(is_file($file)) {
    unlink($file); // delete file
  }
}

$yt = new YoutubeDl();
$collection = $yt->download(
    Options::create()
        ->downloadPath('downloads')
        ->extractAudio(true)
        ->audioFormat('mp3')
        ->audioQuality('0') // best
        ->output('%(title)s.%(ext)s')
        ->url($_GET['url'])
);

foreach ($collection->getVideos() as $video) {
    if ($video->getError() !== null) {
	$eventDataTemp = (object) [
            'status' => 'Error',
	    'reason' => $video->getError()
        ];
    } else {
	$eventDataTemp = (object) [
            'status' => 'Success',
	    'url' => 'https://netdb.ga/yt/' . $video->getFile()
        ];
        echo json_encode($eventDataTemp);
    }
}
