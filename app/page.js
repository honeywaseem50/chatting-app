 
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search, Plus, Send, Moon, Sun, Users, MessageCircle,
  MoreVertical, Paperclip, Smile, ArrowLeft, Phone, Video,
  X, Edit3, Copy, Trash2, Reply, Check,
  Image as ImageIcon, FileText, ChevronDown, ShieldCheck
} from "lucide-react";

const initialGroups = [
  {
    id: 1,
    name: "University Friends",
    avatar: "🎓",
    color: "bg-purple-100",
    members: 12,
    messages: [
      { id: 1, sender: "Ayesha", text: "Hey everyone! How are you? 💜", time: "10:20 AM" },
      { id: 2, sender: "Sara", text: "I'm good! What about you?", time: "10:22 AM" },
      { id: 3, sender: "You", text: "Doing great! 😊", time: "10:25 AM" },
      { id: 4, sender: "Ayesha", text: "Anyone completed the assignment?", time: "10:30 AM" },
    ],
  },
  {
    id: 2,
    name: "Project Team",
    avatar: "💻",
    color: "bg-blue-100",
    members: 5,
    messages: [
      { id: 1, sender: "Ali", text: "Let's discuss our project today.", time: "09:15 AM" },
      { id: 2, sender: "You", text: "Sure! I'm available.", time: "09:20 AM" },
    ],
  },
  {
    id: 3,
    name: "Design Community",
    avatar: "🎨",
    color: "bg-pink-100",
    members: 24,
    messages: [
      { id: 1, sender: "Hira", text: "Check out this new design idea!", time: "Yesterday" },
      { id: 2, sender: "Usman", text: "Looks amazing!", time: "Yesterday" },
    ],
  },
  {
    id: 4,
    name: "Family Group",
    avatar: "🏡",
    color: "bg-amber-100",
    members: 8,
    messages: [
      { id: 1, sender: "Mom", text: "Hope everyone is doing well ❤️", time: "Yesterday" },
    ],
  },
  {
    id: 5,
    name: "Friends Forever",
    avatar: "🌸",
    color: "bg-rose-100",
    members: 9,
    messages: [
      { id: 1, sender: "Zoya", text: "When are we meeting?", time: "Monday" },
    ],
  },
];

const sampleMembers = ["Ayesha", "Sara", "Ali", "Hira", "Usman"];

const emojis = [
  "😀", "😂", "🥰", "😍", "😊", "😉", "😭", "😎",
  "❤️", "💜", "💙", "💗", "💕", "🔥", "✨", "👍",
  "👏", "🙏", "🎉", "🌸", "🌷", "☕", "🎓", "💻"
];

export default function Home() {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedId, setSelectedId] = useState(1);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [dark, setDark] = useState(false);

  // Important: data load hone se pehle saving start nahi hogi.
  const [isLoaded, setIsLoaded] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const [profile, setProfile] = useState({
    name: "Your Profile",
    email: "hello@example.com",
    status: "Available",
    avatar: "H",
  });

  const [editProfile, setEditProfile] = useState(profile);

  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  // LOAD SAVED DATA
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("lavender-theme");

      if (savedTheme !== null) {
        setDark(savedTheme === "dark");
      }

      const savedGroups = localStorage.getItem("lavender-groups");

      if (savedGroups !== null) {
        const parsedGroups = JSON.parse(savedGroups);

        if (Array.isArray(parsedGroups)) {
          setGroups(parsedGroups);
        }
      }

      const savedProfile = localStorage.getItem("lavender-profile");

      if (savedProfile !== null) {
        const parsedProfile = JSON.parse(savedProfile);

        if (parsedProfile && typeof parsedProfile === "object") {
          setProfile((previous) => ({
            ...previous,
            ...parsedProfile,
          }));
        }
      }

      const savedSelectedId = localStorage.getItem("lavender-selected-group");

      if (savedSelectedId !== null) {
        setSelectedId(Number(savedSelectedId));
      }
    } catch (error) {
      console.error("Unable to load saved data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // SAVE THEME
  useEffect(() => {
    if (!isLoaded) return;

    document.documentElement.classList.toggle("dark", dark);

    try {
      localStorage.setItem("lavender-theme", dark ? "dark" : "light");
    } catch (error) {
      console.error("Unable to save theme:", error);
    }
  }, [dark, isLoaded]);

  // SAVE GROUPS AND MESSAGES
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("lavender-groups", JSON.stringify(groups));
    } catch (error) {
      console.error("Unable to save groups:", error);
    }
  }, [groups, isLoaded]);

  // SAVE PROFILE
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("lavender-profile", JSON.stringify(profile));
    } catch (error) {
      console.error("Unable to save profile:", error);
    }
  }, [profile, isLoaded]);

  // SAVE SELECTED GROUP
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("lavender-selected-group", String(selectedId));
    } catch (error) {
      console.error("Unable to save selected group:", error);
    }
  }, [selectedId, isLoaded]);

  // AUTO SCROLL
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groups, selectedId]);

  const selectedGroup = groups.find((group) => group.id === selectedId);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleMessages = selectedGroup?.messages.filter((msg) =>
    msg.text.toLowerCase().includes(messageSearch.toLowerCase()) ||
    msg.sender.toLowerCase().includes(messageSearch.toLowerCase())
  ) || [];

  function updateGroupMessages(callback) {
    setGroups((previous) =>
      previous.map((group) =>
        group.id === selectedId
          ? { ...group, messages: callback(group.messages || []) }
          : group
      )
    );
  }

  function sendMessage(e) {
    e.preventDefault();

    if (!message.trim() || !selectedGroup) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      replyTo: replyTo
        ? { sender: replyTo.sender, text: replyTo.text }
        : null,
    };

    updateGroupMessages((previous) => [...previous, newMessage]);

    setMessage("");
    setReplyTo(null);
    setShowEmoji(false);
  }

  function createGroup(e) {
    e.preventDefault();

    if (!newGroup.trim()) return;

    const group = {
      id: Date.now(),
      name: newGroup.trim(),
      avatar: "💜",
      color: "bg-purple-100",
      members: 1,
      messages: [
        {
          id: Date.now() + 1,
          sender: "You",
          text: "Welcome to the new group!",
          time: "Now",
        },
      ],
    };

    setGroups((previous) => [...previous, group]);
    setSelectedId(group.id);
    setNewGroup("");
    setShowCreate(false);
    setMobileChat(true);
  }

  function saveProfile(e) {
    e.preventDefault();

    if (!editProfile.name.trim()) return;

    setProfile({
      ...editProfile,
      name: editProfile.name.trim(),
      email: editProfile.email.trim(),
      status: editProfile.status.trim() || "Available",
      avatar: editProfile.avatar.trim() || "H",
    });

    setShowEditProfile(false);
  }

  function addEmoji(emoji) {
    setMessage((previous) => previous + emoji);
  }

  async function copyMessage(text) {
    try {
      await navigator.clipboard.writeText(text);
      setActiveMenu(null);
    } catch {
      alert("Unable to copy this message.");
    }
  }

  function deleteMessage(messageId) {
    updateGroupMessages((previous) =>
      previous.filter((msg) => msg.id !== messageId)
    );

    setActiveMenu(null);
  }

  function handleFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: `📎 Attachment: ${file.name}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    updateGroupMessages((previous) => [...previous, newMessage]);

    event.target.value = "";
    setShowAttach(false);
  }

  function lastMessage(group) {
    return group.messages?.[group.messages.length - 1]?.text || "No messages yet";
  }

  // Loading screen
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <MessageCircle size={45} className="mx-auto mb-3 text-[var(--primary)]" />
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Loading Lavender Chat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-0 text-[var(--foreground)] transition-colors duration-300 sm:p-4 lg:p-6">

      <div className="mx-auto flex h-dvh max-w-[1500px] overflow-hidden rounded-none border border-[var(--border)] bg-[var(--surface)] shadow-xl sm:h-[calc(100dvh-2rem)] sm:rounded-2xl lg:h-[calc(100dvh-3rem)]">

        {/* SIDEBAR */}
        <aside
          className={`w-full flex-col border-r border-[var(--border)] bg-[var(--sidebar)] md:flex md:w-[330px] lg:w-[370px] ${
            mobileChat ? "hidden" : "flex"
          }`}
        >

          {/* APP HEADER */}
          <div className="flex items-center justify-between border-b border-[var(--border)] p-5">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 text-white shadow-md">
                <MessageCircle size={23} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Lavender Chat
                </h1>
                <p className="text-xs text-[var(--muted)]">
                  Stay connected 💜
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="rounded-xl p-2.5 transition hover:bg-[var(--primary-light)]"
                title="Toggle theme"
              >
                {dark ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              <button
                onClick={() => setShowCreate(true)}
                className="rounded-xl bg-[var(--primary)] p-2.5 text-white shadow-md transition hover:opacity-80"
                title="Create group"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* GROUP SEARCH */}
          <div className="p-4">
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <Search size={18} className="text-[var(--muted)]" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
              />
            </div>
          </div>

          {/* GROUP LIST */}
          <div className="flex-1 overflow-y-auto px-2 pb-4">

            <div className="mb-3 flex items-center justify-between px-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                Your Groups
              </p>

              <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                {groups.length}
              </span>
            </div>

            {filteredGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  setSelectedId(group.id);
                  setMobileChat(true);
                  setShowDetails(false);
                  setMessageSearch("");
                }}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                  selectedId === group.id
                    ? "bg-[var(--primary-light)]"
                    : "hover:bg-[var(--surface)]"
                }`}
              >

                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${group.color}`}>
                  {group.avatar}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                      {group.name}
                    </p>

                    <span className="text-[10px] text-[var(--muted)]">
                      {group.messages?.[group.messages.length - 1]?.time}
                    </span>
                  </div>

                  <p className="truncate text-xs text-[var(--muted)]">
                    {lastMessage(group)}
                  </p>
                </div>
              </button>
            ))}

            {filteredGroups.length === 0 && (
              <p className="p-5 text-center text-sm text-[var(--muted)]">
                No groups found.
              </p>
            )}
          </div>

          {/* PROFILE CARD */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 border-t border-[var(--border)] p-4 text-left transition hover:bg-[var(--primary-light)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-300 to-violet-500 text-lg font-bold text-white">
              {profile.avatar}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {profile.name}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {profile.status}
              </p>
            </div>

            <MoreVertical size={19} className="text-[var(--muted)]" />
          </button>
        </aside>

        {/* CHAT AREA */}
        <section
          className={`min-w-0 flex-1 flex-col ${
            mobileChat ? "flex" : "hidden md:flex"
          }`}
        >

          {selectedGroup ? (
            <>

              {/* CHAT HEADER */}
              <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-3 py-3 sm:px-6 sm:py-4">

                <div className="flex min-w-0 items-center gap-3">

                  <button
                    onClick={() => setMobileChat(false)}
                    className="rounded-lg p-2 hover:bg-[var(--primary-light)] md:hidden"
                  >
                    <ArrowLeft size={21} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="flex min-w-0 items-center gap-3 rounded-xl text-left hover:opacity-80"
                    title="View group details"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${selectedGroup.color}`}>
                      {selectedGroup.avatar}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold sm:text-base">
                        {selectedGroup.name}
                      </h2>

                      <p className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <Users size={12} />
                        {selectedGroup.members} members
                      </p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-1 sm:gap-3">

                  <button
                    className="hidden rounded-xl p-2.5 hover:bg-[var(--primary-light)] sm:block"
                    title="Voice call demo"
                    onClick={() => alert("Voice calling will be added with backend.")}
                  >
                    <Phone size={19} />
                  </button>

                  <button
                    className="hidden rounded-xl p-2.5 hover:bg-[var(--primary-light)] sm:block"
                    title="Video call demo"
                    onClick={() => alert("Video calling will be added with backend.")}
                  >
                    <Video size={20} />
                  </button>

                  <button
                    onClick={() => {
                      setShowMessageSearch(!showMessageSearch);
                      setMessageSearch("");
                    }}
                    className="rounded-xl p-2.5 hover:bg-[var(--primary-light)]"
                    title="Search messages"
                  >
                    <Search size={19} />
                  </button>

                  <button
                    onClick={() => setShowDetails(true)}
                    className="rounded-xl p-2.5 hover:bg-[var(--primary-light)]"
                    title="Group details"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              </header>

              {/* MESSAGE SEARCH */}
              {showMessageSearch && (
                <div className="border-b border-[var(--border)] bg-[var(--surface)] p-3">
                  <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2">
                    <Search size={17} className="text-[var(--muted)]" />

                    <input
                      autoFocus
                      value={messageSearch}
                      onChange={(e) => setMessageSearch(e.target.value)}
                      placeholder="Search in this conversation..."
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />

                    <button
                      onClick={() => {
                        setShowMessageSearch(false);
                        setMessageSearch("");
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* MESSAGES */}
              <div
                className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-7"
                style={{
                  backgroundColor: "var(--chat-bg)",
                  backgroundImage: dark
                    ? "radial-gradient(#ffffff08 1px, transparent 1px)"
                    : "radial-gradient(#9275d510 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              >

                <div className="mx-auto w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-[10px] font-medium text-[var(--muted)] shadow-sm">
                  TODAY
                </div>

                {visibleMessages.map((msg) => {
                  const ownMessage = msg.sender === "You";

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div className="group relative max-w-[88%] sm:max-w-[70%]">

                        {!ownMessage && (
                          <p className="mb-1 ml-2 text-xs font-semibold text-[var(--primary)]">
                            {msg.sender}
                          </p>
                        )}

                        {msg.replyTo && (
                          <div className={`mb-1 rounded-xl border-l-4 border-[var(--primary)] bg-[var(--primary-light)] p-2 text-xs ${
                            ownMessage ? "text-right" : ""
                          }`}>
                            <p className="font-semibold">
                              {msg.replyTo.sender}
                            </p>
                            <p className="truncate opacity-75">
                              {msg.replyTo.text}
                            </p>
                          </div>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-3 shadow-sm ${
                            ownMessage
                              ? "rounded-br-sm bg-[var(--primary)] text-white"
                              : "rounded-bl-sm border border-[var(--border)] bg-[var(--surface)]"
                          }`}
                        >
                          <p className="break-words text-sm leading-relaxed">
                            {msg.text}
                          </p>

                          <div className="mt-1 flex items-center justify-end gap-1">
                            <p className={`text-right text-[10px] ${
                              ownMessage ? "text-white/70" : "text-[var(--muted)]"
                            }`}>
                              {msg.time}
                            </p>

                            {ownMessage && (
                              <Check size={13} className="text-white/70" />
                            )}
                          </div>
                        </div>

                        {/* MESSAGE OPTIONS */}
                        <div className={`absolute -top-3 z-10 ${
                          ownMessage ? "left-0" : "right-0"
                        }`}>
                          <button
                            onClick={() =>
                              setActiveMenu(activeMenu === msg.id ? null : msg.id)
                            }
                            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1.5 opacity-100 shadow-sm transition sm:opacity-0 sm:group-hover:opacity-100"
                            title="Message options"
                          >
                            <ChevronDown size={15} />
                          </button>

                          {activeMenu === msg.id && (
                            <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-xl">

                              <button
                                onClick={() => {
                                  setReplyTo(msg);
                                  setActiveMenu(null);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs hover:bg-[var(--primary-light)]"
                              >
                                <Reply size={15} /> Reply
                              </button>

                              <button
                                onClick={() => copyMessage(msg.text)}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs hover:bg-[var(--primary-light)]"
                              >
                                <Copy size={15} /> Copy
                              </button>

                              {ownMessage && (
                                <button
                                  onClick={() => deleteMessage(msg.id)}
                                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 size={15} /> Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {visibleMessages.length === 0 && (
                  <p className="py-10 text-center text-sm text-[var(--muted)]">
                    No matching messages found.
                  </p>
                )}

                <div ref={messageEndRef} />
              </div>

              {/* MESSAGE INPUT */}
              <footer className="border-t border-[var(--border)] bg-[var(--surface)] p-3 sm:p-5">

                {replyTo && (
                  <div className="mb-3 flex items-center justify-between rounded-xl bg-[var(--primary-light)] p-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--primary)]">
                        Replying to {replyTo.sender}
                      </p>
                      <p className="truncate text-xs text-[var(--muted)]">
                        {replyTo.text}
                      </p>
                    </div>

                    <button onClick={() => setReplyTo(null)}>
                      <X size={17} />
                    </button>
                  </div>
                )}

                <form
                  onSubmit={sendMessage}
                  className="flex items-center gap-2 sm:gap-3"
                >

                  {/* EMOJI */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmoji(!showEmoji);
                        setShowAttach(false);
                      }}
                      className="rounded-xl p-2.5 text-[var(--muted)] hover:bg-[var(--primary-light)]"
                      title="Choose emoji"
                    >
                      <Smile size={22} />
                    </button>

                    {showEmoji && (
                      <div className="absolute bottom-14 left-0 z-30 w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-bold">Choose Emoji</p>
                          <button type="button" onClick={() => setShowEmoji(false)}>
                            <X size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-6 gap-2">
                          {emojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => addEmoji(emoji)}
                              className="rounded-lg p-1.5 text-xl transition hover:bg-[var(--primary-light)]"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ATTACHMENTS */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAttach(!showAttach);
                        setShowEmoji(false);
                      }}
                      className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--primary-light)] sm:p-2.5"
                      title="Attach file"
                    >
                      <Paperclip size={21} />
                    </button>

                    {showAttach && (
                      <div className="absolute bottom-14 left-0 z-30 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-[var(--primary-light)]"
                        >
                          <ImageIcon size={18} className="text-purple-500" />
                          Photos & Files
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-[var(--primary-light)]"
                        >
                          <FileText size={18} className="text-blue-500" />
                          Documents
                        </button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFile}
                    />
                  </div>

                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                  />

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="rounded-xl bg-[var(--primary)] p-3 text-white shadow-md transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={19} />
                  </button>
                </form>

                <p className="mt-2 hidden text-center text-[10px] text-[var(--muted)] sm:block">
                  Messages are saved locally on this device
                </p>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <MessageCircle size={55} className="text-[var(--primary)]" />
              <h2 className="text-xl font-bold">Welcome to Lavender Chat</h2>
              <p className="text-sm text-[var(--muted)]">
                Select a group to start chatting.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* PROFILE VIEW MODAL */}
      {showProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
              <h2 className="text-lg font-bold">My Profile</h2>
              <button onClick={() => setShowProfile(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-300 to-violet-600 text-4xl font-bold text-white shadow-lg">
                {profile.avatar}
              </div>

              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {profile.email}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--primary-light)] px-4 py-2 text-xs font-semibold text-[var(--primary)]">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {profile.status}
              </div>

              <button
                onClick={() => {
                  setEditProfile(profile);
                  setShowProfile(false);
                  setShowEditProfile(true);
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-white transition hover:opacity-80"
              >
                <Edit3 size={17} />
                Edit Profile
              </button>
            </div>

            <div className="border-t border-[var(--border)] p-4">
              <div className="flex items-center gap-3 rounded-xl p-3">
                <ShieldCheck size={19} className="text-[var(--primary)]" />
                <div>
                  <p className="text-sm font-semibold">Privacy & Security</p>
                  <p className="text-xs text-[var(--muted)]">
                    Profile settings demo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Edit Profile</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Update your personal information.
                </p>
              </div>

              <button onClick={() => setShowEditProfile(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveProfile}>
              <label className="mb-2 block text-sm font-semibold">
                Display Name
              </label>

              <input
                value={editProfile.name}
                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                placeholder="Your name"
                className="mb-4 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                required
              />

              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>

              <input
                type="email"
                value={editProfile.email}
                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                placeholder="your@email.com"
                className="mb-4 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />

              <label className="mb-2 block text-sm font-semibold">
                Status
              </label>

              <input
                value={editProfile.status}
                onChange={(e) => setEditProfile({ ...editProfile, status: e.target.value })}
                placeholder="Available"
                className="mb-4 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />

              <label className="mb-2 block text-sm font-semibold">
                Avatar Initial
              </label>

              <input
                maxLength={2}
                value={editProfile.avatar}
                onChange={(e) => setEditProfile({ ...editProfile, avatar: e.target.value })}
                placeholder="H"
                className="mb-6 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-white transition hover:opacity-80"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GROUP DETAILS PANEL */}
      {showDetails && selectedGroup && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
              <h2 className="text-lg font-bold">Group Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="rounded-lg p-2 hover:bg-[var(--primary-light)]"
              >
                <X size={21} />
              </button>
            </div>

            <div className="flex flex-col items-center border-b border-[var(--border)] px-6 py-8 text-center">
              <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl ${selectedGroup.color}`}>
                {selectedGroup.avatar}
              </div>

              <h3 className="text-xl font-bold">{selectedGroup.name}</h3>

              <p className="mt-2 text-sm text-[var(--muted)]">
                {selectedGroup.members} members · Lavender Chat group
              </p>

              <p className="mt-4 text-sm text-[var(--muted)]">
                Welcome to {selectedGroup.name}! Connect, share updates, and stay in touch.
              </p>
            </div>

            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Members</h3>
                <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                  {selectedGroup.members}
                </span>
              </div>

              <div className="space-y-3">
                {sampleMembers.map((member, index) => (
                  <div key={member} className="flex items-center gap-3 rounded-xl p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)] font-semibold text-[var(--primary)]">
                      {member.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold">{member}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {index === 0 ? "Group admin · Demo member" : "Demo member"}
                      </p>
                    </div>

                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  </div>
                ))}
              </div>

              <p className="mt-4 rounded-xl bg-[var(--background)] p-3 text-xs text-[var(--muted)]">
                These members and online indicators are sample data for the frontend demo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Create New Group</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Give your group a name.
                </p>
              </div>

              <button onClick={() => setShowCreate(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={createGroup}>
              <label className="mb-2 block text-sm font-semibold">
                Group Name
              </label>

              <input
                autoFocus
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                placeholder="e.g. Study Group"
                className="mb-5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />

              <button
                type="submit"
                disabled={!newGroup.trim()}
                className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-white transition hover:opacity-80 disabled:opacity-40"
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
