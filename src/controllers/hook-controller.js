/**
 * Hook routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HookController {
  /**
   * Recieves a Webhook, validates it and sends it to Issue Create Controller.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    req.body = {
      id: req.body.object_attributes.iid,
      title: req.body.object_attributes.title,
      description: req.body.object_attributes.description,
      author: req.body.user.name,
      avatar: req.body.user.avatar_url,
      updated_at: req.body.object_attributes.updated_at,
      state: req.body.object_attributes.state
    }
    console.log(req.body)

    next()
  }

  /**
   * Authorizes the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorize (req, res, next) {
    // Validate the Gitlab Secret Token to be sure that the hook is from the correct sender.
    // This need to be in a database if we have multiple users.
    if (req.headers['x-gitlab-token'] !== process.env.HOOK_SECRET) {
      res.status(403).send('Incorrect Secret')
      return
    }

    next()
  }
}
