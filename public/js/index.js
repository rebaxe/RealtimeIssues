import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

// If taskTemplate is not present on the page, just ignore and do not listen for tasks
if (issueTemplate) {
  // Create a Handlebars template from the template-tag (rendered from index.hbs)
  const hbsTemplate = window.Handlebars.compile(issueTemplate.innerHTML)

  // Create a socket connection using Socket.io
  const socket = window.io('/', { path: '/issues-app/socket.io' })

  // Listen for message "new issue" from the server
  socket.on('issue', arg => {
    // Create a new issue from template.
    const issueString = hbsTemplate(arg)
    const li = document.createElement('li')
    li.classList.add('issue-item')
    li.innerHTML = issueString

    let issueExists = false
    const issues = document.querySelectorAll('.issue-item')
    // Check if the issue already exists - if so, update it.
    issues.forEach(issue => {
      if (issue.querySelector('.issue-id').textContent === `#${arg.id} `) {
        const parent = issue.parentNode
        parent.replaceChild(li, issue)
        issueExists = true
      }
    })
    // If issue does not exist - add new issue.
    if (!issueExists) {
      const issueList = document.querySelector('#issue-list')
      issueList.appendChild(li)
    }
  })
}

const flash = document.querySelector('.flash-container')
if (flash) {
  const closeBtn = document.querySelector('.flash-close')
  closeBtn.addEventListener('click', () => {
    flash.remove()
  })
}
