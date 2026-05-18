const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const checkAll = $("#checkAll")
const checkRows = $$(".check-row")


// check all
checkAll.addEventListener("change", function(){
    checkRows.forEach(row => {
        row.checked = checkAll.checked
    })
})

checkRows.forEach( row => {
    row.addEventListener("change", function(){
        const checksLength = checkRows.length;
        const checkedCount = Array.from(checkRows).filter(c => c.checked).length;

        if(checksLength === checkedCount){
            checkAll.checked = true;
            checkAll.indeterminate = false;
        } else if(checkedCount > 0 && checkedCount < checksLength){
            checkAll.indeterminate = true;
        }else{
            checkAll.checked = false
            checkAll.indeterminate = false;
        }
    })
})