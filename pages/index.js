import { Client } from '@notionhq/client'
import { useEffect, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { capitalize } from 'utils/string'

export default function Home() {
  const [pageData, setPageData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    chrome.tabs &&
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url
        const title = tabs[0].title
        setPageData({ url, title })
      })
  }, [])

  async function saveBookmarkToNotion(bookmark) {
    const notion = new Client({
      auth: process.env.NEXT_PUBLIC_NOTION_API_TOKEN,
    })

    try {
      await notion.pages.create({
        parent: {
          database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: bookmark.title,
                },
              },
            ],
          },
          URL: {
            url: bookmark.url,
          },
          Languages: {
            multi_select: bookmark.languages,
          },
          Tags: {
            multi_select: bookmark.tags,
          },
          Notes: {
            rich_text: [
              {
                text: {
                  content: bookmark.notes || '-',
                },
              },
            ],
          },
        },
      })
      return true
    } catch (error) {
      return false
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSaving(true)

    const data = new FormData(e.target)
    const bookmark = Object.fromEntries(data.entries())

    bookmark.languages = bookmark.languages
      .split(',')
      .filter((language) => language.trim().length !== 0)
      .map((language) => ({
        name: capitalize(language.trim()),
      }))

    bookmark.tags = bookmark.tags
      .split(',')
      .filter((tag) => tag.trim().length !== 0)
      .map((tag) => ({
        name: capitalize(tag.trim()),
      }))

    const result = await saveBookmarkToNotion(bookmark)
    if (result) {
      setIsSaved(true)
    } else {
      setIsSaving(false)
    }
  }

  return (
    <div className="app-wrapper bg-white">
      <div
        className="d-flex justify-content-between align-items-baseline border-bottom p-3 position-sticky bg-white"
        style={{ top: 0 }}
      >
        <h1 className="m-0 h6">💜 Save to Notion Bookmarks</h1>
      </div>
      <div className="p-3 border-bottom">
        {isSaved ? (
          <span className="text-success">✅ Saved</span>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" type="text" defaultValue={pageData.title} title={pageData.title} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>URL</Form.Label>
              <Form.Control name="url" type="url" defaultValue={pageData.url} title={pageData.url} required />
            </Form.Group>
            {/* <Form.Group>
              <Form.Label>Languages</Form.Label>
              <Form.Control name="languages" type="text" />
              <Form.Text muted>Separate Languages with Commas</Form.Text>
            </Form.Group> */}
            <Form.Group>
              <Form.Label>Tags</Form.Label>
              <Form.Control name="tags" type="text" />
              <Form.Text muted>Separate Tags with Commas</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control name="notes" as="textarea" rows={3} />
            </Form.Group>
            <div className="mt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-100 d-flex justify-content-center align-items-center"
                disabled={isSaving}
              >
                {isSaving ? <Spinner className="mr-1" size="sm" animation="border" role="status" /> : ''}
                {isSaving ? <span>Saving</span> : <span>Save</span>}
              </Button>
            </div>
          </Form>
        )}
      </div>
      <div>
        <a
          href={`https://www.notion.so/ravsamhq/${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`}
          className="btn btn-light rounded-0 w-100 text-left px-3 py-2"
          target="_blank"
          rel="noreferrer"
        >
          Visit Bookmarks{' '}
          <svg width="12px" height="12px" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <g strokeWidth="2.1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 13.5 17 19.5 5 19.5 5 7.5 11 7.5"></polyline>
              <path d="M14,4.5 L20,4.5 L20,10.5 M20,4.5 L11,13.5"></path>
            </g>
          </svg>
        </a>
      </div>
    </div>
  )
}
