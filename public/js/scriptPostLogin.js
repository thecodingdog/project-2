$(function () {
  createTable()
})

function findCalories(){
  // push calories into array if found in class calories and not zero
  // sum everything in array
}

function createTable(){
  console.log('newtable');
  let $newTr=$('<tr>')

    let $newTd=$('<td>')
    let calories = $('#calories').text()
    $newTd.text(`Total Calores is ${calories}`)
    $newTr.append($newTd)
    // $newTd.text('200')
    // $newTr.append($newTd)
    // $newTd.text('chicken')
    // $newTr.append($newTd)
    // $newTd.text('50')
    // $newTr.append($newTd)

  $('#table').append($newTr)
}
