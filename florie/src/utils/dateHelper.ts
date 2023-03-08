const monthArray = ['Jan', 'Feb', 'March','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function getFormattedDate(dateTime:any) {
     var date = new Date(dateTime)
     var year = date.getFullYear()
     var months =  monthArray[date.getMonth()]
     var day = date.getDate()

     const formattedDate =
     months + ' ' + day + ', ' + year 
     return formattedDate
   }
   export function getFormattedDateForGraph(dateTime:any) {
    var date = new Date(dateTime)
    var year = date.getFullYear()
    var months =  monthArray[date.getMonth()]
    var day = date.getDate()

    const formattedDate =
    months + ' ' + day 
    return formattedDate
  }

   export function getTime(dateTime:any) {
     var date = new Date(dateTime)
     var year = date.getFullYear()
     var months =  monthArray[date.getMonth()]
     var day = date.getDate()
     var time = date.getTime()
     var updateTime = new Date(time * 1000)
     var hours = updateTime.getHours()
     var minutes = "0" + updateTime.getMinutes()
     var formattedTime = hours + ':' + minutes.substr(-2)
     const formattedDate =
       day + ' / ' + months + ' / ' + year + ' : ' + formattedTime
     return formattedTime
   }
