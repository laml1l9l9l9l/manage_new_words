const fs = require("fs")
const readline = require('readline')
const config = require('./config')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function readLineAsync(message) {
  return new Promise((resolve, reject) => {
    rl.question(message, (answer) => {
      resolve(answer)
    })
  })
}

function remakeNameLesson(lesson) {
  const name_book = config.name_book
  let remake_name_lesson = lesson
  if (lesson.includes('unit')) {
    remake_name_lesson += ' - ' + name_book
  }
  return remake_name_lesson
}

function addWord(arr_list_words, word, type_word, lesson) {
  let is_add_word = true
  word = word.toLowerCase()
  lesson = lesson.toLowerCase()
  type_word = type_word.toLowerCase()
  for (let i = 0; i < arr_list_words.length; i++) {
    let obj_info_word = arr_list_words[i]
      , word_in_list = obj_info_word.word
    if (word === word_in_list) {
      is_add_word = false
      console.log("This word has existed")
    }
  }
  if(is_add_word) {
    lesson = remakeNameLesson(lesson)
    let obj_info_word = {
      lesson,
      word,
      type_word
    }
    arr_list_words.push(obj_info_word)
    console.log("Add word successfully")
  }
  return arr_list_words
}

function editWord(arr_list_words, word, new_word, new_type_word, new_lesson) {
  let is_change_word = false
  word = word.toLowerCase()
  new_word = new_word.toLowerCase()
  new_lesson = new_lesson.toLowerCase()
  new_type_word = new_type_word.toLowerCase()
  for (let i = 0; i < arr_list_words.length; i++) {
    let obj_info_word = arr_list_words[i]
      , word_in_list = obj_info_word.word
    if (word === word_in_list) {
      is_change_word = true
      new_lesson = remakeNameLesson(new_lesson)
      arr_list_words[i].word = new_word
      arr_list_words[i].lesson = new_lesson
      arr_list_words[i].type_word = new_type_word
    }
  }
  if (is_change_word) {
    console.log("Update word successfully")
  } else {
    console.log("Not found word")
  }
  return arr_list_words
}

function searchWord(arr_list_words, word) {
  let regex_word
    , arrSearchListWords = []
  word = word.toLowerCase()
  regex_word = new RegExp(word)
  for (let i = 0; i < arr_list_words.length; i++) {
    let obj_info_word = arr_list_words[i]
      , word_in_list = obj_info_word.word
    if (regex_word.test(word_in_list)) {
      arrSearchListWords.push(obj_info_word)
    }
  }
  return arrSearchListWords
}

async function addWord2TakeNote () {
  let arr_list_words = fs.readFileSync(config.path_take_note, {encoding:'utf8', flag:'r'})
    , word
    , type_word
    , lesson
    , type_action
    , mess_choice_type_action = "1: Add word\n2: Edit word\n3: Search words\nEnter number type of action: "
    , isUpdateListWords = true
    , isSearchListWords = false
    , arrSearchListWords = []
  type_action = await readLineAsync(mess_choice_type_action)
  arr_list_words = JSON.parse(arr_list_words)
  switch (type_action) {
    case "1":
      word = await readLineAsync("Enter new word: ")
      type_word = await readLineAsync("Type of Word: ")
      lesson = await readLineAsync("Enter lesson: ")
      arr_list_words = addWord(arr_list_words, word, type_word, lesson)
      break
    case "2":
      let new_word
        , new_type_word
        , new_lesson
      word = await readLineAsync("Enter word that you want to edit: ")
      new_word = await readLineAsync("Enter word that you will change: ")
      new_type_word = await readLineAsync("Type of Word that you will change: ")
      new_lesson = await readLineAsync("Enter lesson: ")
      arr_list_words = editWord(arr_list_words, word, new_word, new_type_word, new_lesson)
      break
    case "3":
      word = await readLineAsync("Enter word: ")
      arrSearchListWords = searchWord(arr_list_words, word)
      isUpdateListWords = false
      isSearchListWords = true
      break
    default:
      console.log("Number is wrong!")
      isUpdateListWords = false
      await addWord2TakeNote()
      break
  }
  if (isUpdateListWords) {
    arr_list_words = JSON.stringify(arr_list_words)
    fs.writeFileSync(config.path_take_note, arr_list_words)
    process.exit()
  }
  if (isSearchListWords) {
    arrSearchListWords = JSON.stringify(arrSearchListWords)
    console.log(arrSearchListWords)
    process.exit()
  }
}

addWord2TakeNote()

/* Edit file take note */
function updateFileTakeNote () {
  let arr_list_words = fs.readFileSync(config.path_take_note, {encoding:'utf8', flag:'r'})
  arr_list_words = JSON.parse(arr_list_words)
  for (let i = 0; i < arr_list_words.length; i++) {
    let word = arr_list_words[i].word
      , lesson = arr_list_words[i].lesson
      , type_word = arr_list_words[i].type_word
    if (lesson.includes('unit')) {
      lesson += ' - Destination B1 Grammar And Vocabulary'
    }
    arr_list_words[i] = {
      lesson,
      word,
      type_word
    }
  }
  arr_list_words = JSON.stringify(arr_list_words)
  fs.writeFileSync(config.path_take_note, arr_list_words)
  process.exit()
}
// updateFileTakeNote()