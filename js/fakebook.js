//rules for lead sheet:
//First line is Title - Artist
//All sections divided into 'blocks' delimited by empty lines
//No block gets split between pages
var pageHeight = 10;

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



function chordify() {

    var input = document.getElementsByClassName("chords");
    for (var i = 0; i < input.length; i++) {
        const rawReg = /\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|sus2)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|sus2)*[\d\/]*)*)(?=\s|$)(?! \w)/;
        const chordReg = "<span class='jazztext-font'>$1</span>";

        let output = input[i].innerHTML.replaceAll("-", "&mdash;");
        output = output.replaceAll(rawReg, chordReg).replaceAll("\n", "<br />").replaceAll("   ", "&nbsp;&nbsp;&nbsp;");
        input[i].innerHTML = output;
    }
}

function showEditor() {
    document.getElementById("drop_zone").classList.remove("hidden");
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    var reader = new FileReader();
    reader.onload = function (evt) {
        document.getElementById('drop_zone').innerHTML = evt.target.result;
        document.getElementById('drop_zone').value = evt.target.result;

        loadSheet(evt.target.result);
        document.getElementById('drop_zone').classList.add("hidden");
    }
    reader.readAsText(files[0], "UTF-8");

}

function getLinesInBlock(block) {
    console.log(block.split(/\r\n|\r|\n/).length);
    console.log(block);
    return block.split(/\r\n|\r|\n/).length;
}


function loadSheet(response) {
    var pageLength = 0;

    $('#lead-sheet-container').text('');
    var songArray = response.replace(/\n\n/g, "\r\n\r\n").split(/\r\n\r\n/);
    var htmlResponse = "";
    htmlResponse = htmlResponse + "<div class='chord-sheet'>";
    htmlResponse = htmlResponse + '<h1>' + songArray[0] + '<button id="edit" onclick="showEditor();" ><i class="fas fa-edit"></i></button></h1>';
    htmlResponse = htmlResponse + "<div class='chords'>";

    for (var i = 1; i < songArray.length; i++) {
        songChunk = songArray[i].replace(/\n/, "<br />")
        if (pageLength > pageHeight) // end of block
        {

            pageLength = getLinesInBlock(songArray[i]);;
            htmlResponse = htmlResponse + "</div></div><div class='chord-sheet'><div class='chords'>" + songChunk + "<br /><br />";
        }
        else {

            pageLength = pageLength + getLinesInBlock(songChunk);
            htmlResponse = htmlResponse + songArray[i] + "<br /><br />";

        }
    }
    
    $('#lead-sheet-container').append(htmlResponse);

    var pages = document.querySelectorAll('.chord-sheet');

    const pageFlip = new St.PageFlip(document.getElementById('lead-sheet-container'),
        {
            width: 600, // required parameter - base page width
            height: 1200,  // required parameter - base page height
            size: "stretch",
            flippingTime: 200,

        }
    );

    chordify();
    pageFlip.loadFromHTML(pages);
    $(".chord-sheet").keydown(function (event) {

        if (event.keyCode == 8){
            event.preventDefault();
            pageFlip.flipPrev ();
           }

        if (event.keyCode == 32){
            e.preventDefault();
            pageFlip.flipNext();
           }
        
        });
}

$().ready(function () {

    $().keydown(function (event) {

        if ((event.keyCode == 13) && ($(event.target)[0] != $("textarea")[0])) {
            event.preventDefault();
            return false;
        }

      
        });
    });