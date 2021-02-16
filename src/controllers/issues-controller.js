/**
 * Issues controller.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import fetch from 'node-fetch'

const URL = process.env.API_URL
const TOKEN = process.env.ACCESS_TOKEN

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    const gitLabIssues = await fetch(URL, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    console.log(gitLabIssues)
    const viewData = {
      issues: gitLabIssues.map(
        issue => ({
          id: issue.iid,
          title: issue.title,
          description: issue.description,
          avatar: issue.author.avatar_url
        })
      ).sort((a, b) => {
        return a.id - b.id
      })
    }
    console.log(viewData)
    res.render('issues/index', { viewData })
  }
}
