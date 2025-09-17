document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("microblog-conversation__wrapper");

  if (!wrapper) return;

  const expand = () => {
    // Force a layout so the browser knows the current height (0)
    wrapper.style.height = "0";

    // Wait until the next paint – ensures the new nodes are measured
    requestAnimationFrame(() => {
      // Now the browser has computed scrollHeight for the fresh content
      const target = wrapper.scrollHeight + "px";
      wrapper.style.height = target;
    });
  };

  const observer = new MutationObserver((mutations) => {
    // We only need to act on the *first* mutation that actually adds nodes
    const added = mutations.some((m) => m.addedNodes.length);
    if (added) {
      expand(); // kick off the smooth growth
      // If you never expect further changes, disconnect now:
      observer.disconnect();
    }
  });

  observer.observe(wrapper, { childList: true, subtree: true });

  function removeSpinnerWithFadeOut(spinner) {
    spinner.classList.add("fade-out");
    setTimeout(() => {
      spinner.remove();
    }, 620); // Match your animation duration
  }

  // Load the microblog conversation as JSON and render DOM
  const conversationUrl = wrapper.getAttribute("data-conversation-url");

  function formatDate(dateString, full = false) {
    const date = new Date(dateString);
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return full
      ? `${year}-${month}-${day} ${hours}:${minutes}`
      : `${hours}:${minutes}`;
  }

  function extractConversationId(homeUrl) {
    try {
      const u = new URL(homeUrl);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    } catch (_) {
      return null;
    }
  }

  function renderConversation(feed) {
    const items = Array.isArray(feed.items) ? feed.items : [];
    const postsHtml = items
      .map((item, index) => {
        const avatar = (item.author && item.author.avatar) || "";
        const name = (item.author && item.author.name) || "";
        const link = item.url || "#";
        const authorLink = item.author.url || link;
        const showFull = index === 0;
        const time = item.date_published
          ? formatDate(item.date_published, showFull)
          : "";
        const content = item.content_html || "";
        return `
        <div class="microblog_post">
        <div class="microblog_user">
        <a href="${authorLink}" class="microblog_user-link" title="Visit the authors site">
        <img class="microblog_avatar" src="${avatar}" width="20" height="20">
        <span class="microblog_fullname">${name}</span>
        </a>
        <span class="microblog_time"><a href="${link}">${time}</a></span>
        </div>
        <div class="microblog_text">${content}</div>
        </div>`;
      })
      .join("");

    const convoId = extractConversationId(feed.home_page_url || "");
    const pageUrl = conversationUrl || "";
    // Enhance: support logged-in state via URL params like ?token=...&username=...
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");

    // Clean the URL so token/username aren't visible after reading them
    if (token || username) {
      try {
        const current = new URL(window.location.href);
        current.search = "";
        history.replaceState({}, document.title, current.toString());
      } catch (_) {
        // no-op if URL manipulation fails
      }
    }

    const isLoggedIn = Boolean(username && username.length > 0);

    const signinHtml = isLoggedIn
      ? `<p class="microblog_reply_signin">Replying as @${username}:</p>`
      : `<p class="microblog_reply_signin"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="position: relative; top: 2px; margin-right: 6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Sign in with <a href="https://micro.blog/account/comments/${convoId}/mb?url=${pageUrl}">Micro.blog</a>, <a href="https://micro.blog/account/comments/${convoId}/mastodon?url=${pageUrl}">Mastodon</a>, or <a href="https://micro.blog/account/comments/${convoId}/bluesky?url=${pageUrl}">Bluesky</a> to reply:</p>`;

    const textareaHtml = isLoggedIn
      ? `<p class="microblog_reply_textarea"><textarea name="text" rows="4" cols="50"></textarea></p>`
      : `<p class="microblog_reply_textarea"><textarea name="text" rows="4" cols="50" disabled></textarea></p>`;

    const buttonHtml = isLoggedIn
      ? `<p class="microblog_reply_button"><input type="submit" value="Post"></p>`
      : `<p class="microblog_reply_button"><input type="submit" value="Post" disabled></p>`;

    const formHtml = `\n<form method="POST" class="microblog_reply_form" ${convoId ? `action="https://micro.blog/account/comments/${convoId}/post"` : ""}>\n\t${signinHtml}\n\t<input type="hidden" name="token" value="${token || ""}">\n\t<input type="hidden" name="username" value="${username || ""}">\n\t<input type="hidden" name="url" value="${pageUrl}">\n\t${textareaHtml}\n\t${buttonHtml}\n</form>`;

    const html = `<div class="microblog_conversation">${postsHtml}${formHtml}</div>`;
    wrapper.innerHTML = html;
  }

  async function loadConversation() {
    if (!conversationUrl) return;
    try {
      const jsonUrl = `https://micro.blog/conversation.js?format=jsonfeed&url=${encodeURIComponent(conversationUrl)}`;
      const res = await fetch(jsonUrl, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const feed = await res.json();
      renderConversation(feed);
      removeSpinnerWithFadeOut(document.querySelector(".spinner-container"));
    } catch (err) {
      removeSpinnerWithFadeOut(document.querySelector(".spinner-container"));
      wrapper.innerHTML = `<p class="microblog-error">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-crack-icon lucide-heart-crack"><path d="M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15"/><path d="M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z"/></svg>
        &nbsp;Unable to load replies</p>`;
    }
  }

  loadConversation();

  // Handle case where content is already present
  if (wrapper.childElementCount) {
    requestAnimationFrame(expand);
  }
});
