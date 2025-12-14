import { createServerFn } from '@tanstack/react-start'
import { App } from 'octokit'
import type { Octokit } from 'octokit'

const REPO_OWNER = 'BlankOn'
const REPO_NAME = 'Teras'
const DISCUSSION_CATEGORY_NAME = 'Docs Feedback'

interface FeedbackInput {
  url: string
  opinion: 'good' | 'bad'
  message: string
}

interface ActionResponse {
  githubUrl: string
}

async function getOctokit(): Promise<Octokit> {
  const appId = process.env.GITHUB_APP_ID
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY

  if (!appId || !privateKey) {
    throw new Error(
      'Feedback feature is not configured. Missing GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY environment variables.',
    )
  }

  const app = new App({
    appId,
    privateKey,
  })

  const { data: installation } = await app.octokit.request(
    'GET /repos/{owner}/{repo}/installation',
    {
      owner: REPO_OWNER,
      repo: REPO_NAME,
    },
  )

  return app.getInstallationOctokit(installation.id)
}

async function getDiscussionCategoryId(octokit: Octokit): Promise<string> {
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        discussionCategories(first: 25) {
          nodes {
            id
            name
          }
        }
      }
    }
  `

  const result = await octokit.graphql<{
    repository: {
      discussionCategories: {
        nodes: Array<{ id: string; name: string }>
      }
    }
  }>(query, {
    owner: REPO_OWNER,
    repo: REPO_NAME,
  })

  const category = result.repository.discussionCategories.nodes.find(
    (c) => c.name === DISCUSSION_CATEGORY_NAME,
  )

  if (!category) {
    throw new Error(
      `Discussion category "${DISCUSSION_CATEGORY_NAME}" not found. Please create it in GitHub Discussions settings.`,
    )
  }

  return category.id
}

async function getRepositoryId(octokit: Octokit): Promise<string> {
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        id
      }
    }
  `

  const result = await octokit.graphql<{
    repository: { id: string }
  }>(query, {
    owner: REPO_OWNER,
    repo: REPO_NAME,
  })

  return result.repository.id
}

async function findExistingDiscussion(
  octokit: Octokit,
  url: string,
): Promise<{ id: string; url: string } | null> {
  const query = `
    query($owner: String!, $repo: String!, $query: String!) {
      search(query: $query, type: DISCUSSION, first: 1) {
        nodes {
          ... on Discussion {
            id
            url
            title
          }
        }
      }
    }
  `

  const searchQuery = `repo:${REPO_OWNER}/${REPO_NAME} in:title "Feedback for ${url}"`

  const result = await octokit.graphql<{
    search: {
      nodes: Array<{ id: string; url: string; title: string }>
    }
  }>(query, {
    owner: REPO_OWNER,
    repo: REPO_NAME,
    query: searchQuery,
  })

  const discussion = result.search.nodes[0] as
    | { id: string; url: string; title: string }
    | undefined
  if (discussion?.title === `Feedback for ${url}`) {
    return { id: discussion.id, url: discussion.url }
  }

  return null
}

async function createDiscussion(
  octokit: Octokit,
  url: string,
  opinion: 'good' | 'bad',
  message: string,
): Promise<string> {
  const repositoryId = await getRepositoryId(octokit)
  const categoryId = await getDiscussionCategoryId(octokit)

  const opinionEmoji = opinion === 'good' ? '👍' : '👎'
  const body = `## Feedback\n\n**Opinion:** ${opinionEmoji} ${opinion}\n\n**Message:**\n${message || '_No message provided_'}`

  const mutation = `
    mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
      createDiscussion(input: {
        repositoryId: $repositoryId,
        categoryId: $categoryId,
        title: $title,
        body: $body
      }) {
        discussion {
          url
        }
      }
    }
  `

  const result = await octokit.graphql<{
    createDiscussion: {
      discussion: { url: string }
    }
  }>(mutation, {
    repositoryId,
    categoryId,
    title: `Feedback for ${url}`,
    body,
  })

  return result.createDiscussion.discussion.url
}

async function addCommentToDiscussion(
  octokit: Octokit,
  discussionId: string,
  opinion: 'good' | 'bad',
  message: string,
): Promise<string> {
  const opinionEmoji = opinion === 'good' ? '👍' : '👎'
  const body = `**Opinion:** ${opinionEmoji} ${opinion}\n\n**Message:**\n${message || '_No message provided_'}`

  const mutation = `
    mutation($discussionId: ID!, $body: String!) {
      addDiscussionComment(input: {
        discussionId: $discussionId,
        body: $body
      }) {
        comment {
          url
        }
      }
    }
  `

  const result = await octokit.graphql<{
    addDiscussionComment: {
      comment: { url: string }
    }
  }>(mutation, {
    discussionId,
    body,
  })

  return result.addDiscussionComment.comment.url
}

export const onRateAction = createServerFn({ method: 'POST' })
  .inputValidator((data: FeedbackInput) => data)
  .handler(
    async ({ data }: { data: FeedbackInput }): Promise<ActionResponse> => {
      const { url, opinion, message } = data

      const octokit = await getOctokit()
      const existingDiscussion = await findExistingDiscussion(octokit, url)

      let githubUrl: string

      if (existingDiscussion) {
        githubUrl = await addCommentToDiscussion(
          octokit,
          existingDiscussion.id,
          opinion,
          message,
        )
      } else {
        githubUrl = await createDiscussion(octokit, url, opinion, message)
      }

      return { githubUrl }
    },
  )
