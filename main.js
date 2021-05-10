// import { promises as fs } from './node_modules/fs';
// I can't have fs or it tells me
// Failed to load module script: The server responded with a non-JavaScript MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.
let csvFile;


function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    var table = '<table>';
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      if (singleRow === 0) {
        table += '<thead>';
        table += '<tr>';
      } else {
        table += '<tr>';
      }
      var rowCells = allRows[singleRow].split(',');
      console.log(rowCells)
      for (var rowCell = 0; rowCell < rowCells.length ; rowCell++) {
          console.log(allRows[singleRow])
        if (singleRow === 0) {
          table += '<th>';
          table += rowCells[rowCell];
          table += '</th>';
        } 
        else {
          table += '<td>';
          table += rowCells[rowCell];
          table += '</td>';
          // try to add the classname based on the plant name from csv file
          if(rowCell % 4 === 0){
            $('.garden').append(
                `<div class="${rowCells[rowCell]} square" onclick="dragSquare(event)"></div>`
            )
            // try to add the hovercard based on csv file
            var hoverCardMainContent = `<p>${rowCells[rowCell]}</p>`;
            // TODO: FIX THE BROKEN HOVERCARD CONTENT
            // let thingToParse= "." + rowCells[rowCell].toString()
            // // assign the hoverCard functionality to all squares
            // $(thingToParse).hovercard({
            //     detailsHTML: hoverCardMainContent,
            //     width: 400,
            //     cardImgSrc: `./${rowCells[rowCell+2]}`
            // })
          }
          // read from CSV the left and top values in X and Y columns
          if(rowCell % 2 === 0 && rowCell % 4 !== 0){
              // we must be in the third column, so let's set the top offset to be equal to this cell's value 
            // $(`.${rowCells[rowCell]}`).css('top', rowCells[rowCell]);
            $( `div[class~=${rowCells[rowCell-2]}]` ).css('top', rowCells[rowCell] + 'px')
            console.log('we in the mod two setting top offset', rowCells[rowCell], ' on ', rowCells[rowCell-2])
          }
          if(rowCell % 5 === 1){
            // we must be in the third column, so let's set the left offset to be equal to this cell's value 
            $( `div[class~=${rowCells[rowCell-1]}]` ).css('left', rowCells[rowCell] + 'px');
           console.log('we in the mod five setting left offset', rowCells[rowCell], ' on ', rowCells[rowCell-1])
        }
        }
      }
      if (singleRow === 0) {
        table += '</tr>';
        table += '</thead>';
        table += '<tbody>';
      } else {
        table += '</tr>';
      }
    } 
    table += '</tbody>';
    table += '</table>';
    $('body').append(table);
    // make all squares draggable
    $(".square").draggable( {containment: ".garden", scroll: false} );
    
  }

   let dragSquare = (e) => {
    //console.log('left', e.path[1].clientLeft, 'top', e.path[1].clientTop)
    // write to CSV file the left and top values of the dragged item
    const mySquare = e.target;
    const topToSet = mySquare.style.top;
    const leftToSet = mySquare.style.left; 
    // pretending there's only one copy of each thing and class identifier is unique
    const nameOfPlant = mySquare.getAttribute('class').split(" ")[0]
    console.log(nameOfPlant)
    // write to parsed file here
    writeCSVcontent(nameOfPlant, leftToSet, topToSet)
}

function writeCSVcontent(nameOfPlant, leftToSet, topToSet){
    fs.readFile ('./data.csv', 'utf8', (err,data)=>{
        if (err){
            console.log (err.message)
        }
        let arr = []
        let myPlants = data.trim().split('\n')
        for (const item of myPlants) {
            arr.push (item.split(","))
        }
        console.log (arr)
    })
    // modify the array to have the new content
    //arr[0] = `${arr[0]}`
}

$(document).ready(function(){
    // at this scope, "this" refers to the #document (DOM)
    // which means we can't use it to gain access to the dragSquare function
    // which is what's throwing our error in the place we assign it as the onclick
    // when we are generating and appending squares of dirt. sad day.
    console.log(this)
    //load the data
    $.ajax({
        url: 'data.csv',
        dataType: 'text',
      }).done(successFunction);
    
    });
