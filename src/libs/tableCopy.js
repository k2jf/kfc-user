
export default function tableCopy (htmlToCopy, ...args) {
  let el = document.getElementById(htmlToCopy)
  console.log(el)
  let html = ''
  for (let k = 0; k < args.length - 1; k = k + 2) {
    let def = ''
    let titlekey = []
    for (let i = 0; i < args[k].length; i++) {
      def += args[k][i].title + '\t'
      titlekey.push(args[k][i].key)
    }
    console.log(def)
    html += def + '\r\n'
    for (let i = 0; i < args[k + 1].length; i++) {
      let rowhtml = ''
      for (let j = 0; j < titlekey.length; j++) {
        let item = args[k + 1][i][titlekey[j]]
        // item = item
        rowhtml += item + '\t'
      }
      html += rowhtml + '\r\n'
    }
  }
  el.value = html
  console.log(html.toString())
  el.select()
  console.log(el.value)
  document.execCommand('Copy')
}
