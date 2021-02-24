import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

// If taskTemplate is not present on the page, just ignore and do not listen for tasks
if (issueTemplate) {
  // Create a Handlebars template from the template-tag (rendered from index.hbs)
  const hbsTemplate = window.Handlebars.compile(issueTemplate.innerHTML)

  // Create a socket connection using Socket.io
  const socket = window.io()

  // Listen for message "new issue" from the server
  socket.on('issue', arg => {
    const issueString = hbsTemplate(arg)
    const li = document.createElement('li')
    li.classList.add('issue-item')
    li.innerHTML = issueString

    const issueList = document.querySelector('#issue-list')
    issueList.appendChild(li)
  })
}
