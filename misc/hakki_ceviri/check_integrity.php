<?

function checkIntegrity(){
	// Connecting, selecting database
	$link = mysql_connect('localhost:8889', 'root', 'root')
		or die('Could not connect: ' . mysql_error());
	echo 'Connected successfully';
	mysql_select_db('kurancalis') or die('Could not select database');
	
	// Performing SQL query
	$query = 'select chapter, verse from translation where translation.author_id = 262144 order by chapter, verse;';
	$result = mysql_query($query) or die('Query failed: ' . mysql_error());
	

	$lastChapter=0;
	$lastVerse=0;
	while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
		$chapter = $line['chapter'];
		$verse = $line['verse'];
		if($lastChapter == $chapter){
			if($verse != $lastVerse+1){
				print($chapter.":".$verse."\n");
			}
		}	
		$lastChapter = $chapter;
		$lastVerse = $verse;
		
	}
	mysql_free_result($result);
	
}

checkIntegrity();