var pageHeight = 40;
var page = null;
class Song {
    
    constructor(fileName,data)
    {
        this.fileName=fileName;this.data=data;
        this.songBlocks= (data.toString());
    }
    toHTML()
    {
        return data.replaceAll(/\n\r|\n|\r/,"<br />")
        .replaceAll("   ", "&nbsp;&nbsp;&nbsp;");
    }
    toSheets(){
        return chordify(data);
    
    }
    toString(){return this.data;}
    get Title(){return this.data.split(/\n/)[0];}
    get SongBlocks(){
        return this.data.split(/(\r\n\r\n)/g);
    }
    get ChordSummary(){var songLines = data.split(/\n/)}
 

}
const screenshotTarget = document.body;

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


function chordify(input) {

    const rawReg = /\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|sus2)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|sus2)*[\d\/]*)*)(?=\s|$)(?! \w)/;
    const chordReg = "<span class='jazztext-font'>$1</span>";

    return  input.toString().replaceAll(rawReg, chordReg);
}
function tabify(songText){
    var firstReplace = songText.replaceAll("|","&#9473;");
    var secondReplace =songText.replaceAll("-", "&#9473;");
    console.log(firstReplace);
    console.log(secondReplace);
    return secondReplace;
}



function dropHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    var reader = new FileReader();
    reader.onload = function (evt) {
        document.getElementById('editor').innerHTML = evt.target.result;
        document.getElementById('editor').value = evt.target.result;

        loadSheet(evt.target.result);
        document.getElementById('drop_zone').classList.add("w3-hide");
    }
    reader.readAsText(files[0], "UTF-8");

}



function getLinesInBlock(block)
{
    return block.split(/\r\n|\r|\n/).length;
}

function loadSheet(response) {
    var pageLength = 0;

    var ourSong = new Song("farts.crd",response);
    
    var template = $("div.chord-sheet[name=template]");

    var ourPage = $(template).clone().appendTo("div#lead-sheet-container");
    for (var i = 0; i < ourSong.SongBlocks.length;i++){//songArray.length; i++) {
        
        if (pageLength > pageHeight) // end of block
        {
            ourPage = $(template).clone().appendTo("div#lead-sheet-container");
            pageLength = getLinesInBlock(ourSong.SongBlocks[i]);;
        }
        else {
            pageLength = pageLength + getLinesInBlock(ourSong.SongBlocks[i]);
        }
        $(ourPage).find(".chords").append( chordify(tabify(ourSong.SongBlocks[i].toString())));
        var replacementTitle = "<h1>" +ourSong.Title +"</h1>";
        console.log(replacementTitle);
        
        $(template).remove();
    }
    $("div#lead-sheet-container").html( $("div#lead-sheet-container").html().replace(ourSong.Title, replacementTitle ));

    var pages = document.querySelectorAll('.chord-sheet');

    pageFlip = new St.PageFlip(document.getElementById('lead-sheet-container'),
        {
            width: 600, // required parameter - base page width
            height: 800,  // required parameter - base page height
            size: "stretch",
            flippingTime: 200,
        }
    );
    $("button#print").on("click",function(){

        pageFlip.destroy();

        loadSheet(document.getElementById('editor').innerHTML);
        window.print();
    });
    
    $('#song-title').innerHTML = ourSong.Title;

    //pageFlip.loadFromHTML(pages);
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

function showEditor() {
    $("#editor").toggleClass("w3-hide");
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function download() {
    text = $("textarea").val();
    filename = text.split("/n/n")[0] + ".crd";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  function downloadHTML() {

    text = document.getElementsByTagName("html")[0].innerHTML;

    filename = $("textarea").val().split("\n\n")[0];
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
  }
$().ready(function () {

    $().keydown(function (event) {

            if ((event.keyCode == 13) && ($(event.target)[0] != $("textarea")[0])) {
                event.preventDefault();
                return false;
            }
        });
    });
    