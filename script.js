/* 
   حاملات المسك — سجل خاتمات القرآن الكريم
    */


/* 
   Supabase settings
    */

const SUPABASE_URL =
    "https://fesyiofmabiflmqydbxp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_pqfXZLuTi-L4Ki3BrLgM6w_HybS9eeY";

const db =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            },
        }
    );


let students = [];

let isTeacherLoggedIn = false;

let tempPassword = null;

let tempExpiresAt = null;

let selectedStudent = null;

let selectedDetailsMode = null;


/* 
   Page elements
    */

const el = (id) =>
    document.getElementById(id);


const loginButton =
    el("loginButton");

const loginModal =
    el("loginModal");

const loginForm =
    el("loginForm");

const loginError =
    el("loginError");

const loginEmail =
    el("loginEmail");

const loginPassword =
    el("loginPassword");

const submitLogin =
    el("submitLogin");

const forgotPassword =
    el("forgotPassword");

const logoutButton =
    el("logoutButton");

const generatePasswordButton =
    el("generatePasswordButton");

const addButton =
    el("addButton");


const searchInput =
    el("searchInput");

const sortSelect =
    el("sortSelect");


const modal =
    el("modal");

const modalTitle =
    el("modalTitle");

const studentForm =
    el("studentForm");

const saveButton =
    el("saveButton");


const noticeModal =
    el("noticeModal");

const noticeTitle =
    el("noticeTitle");

const noticeMessage =
    el("noticeMessage");

const noticeInput =
    el("noticeInput");

const noticeCancel =
    el("noticeCancel");

const noticeConfirm =
    el("noticeConfirm");

const noticeIcon =
    el("noticeIcon");

const closeNotice =
    el("closeNotice");


const studentDetailsModal =
    el("studentDetailsModal");

const closeStudentDetails =
    el("closeStudentDetails");

const studentDetailsName =
    el("studentDetailsName");

const studentDetailsSubtitle =
    el("studentDetailsSubtitle");


const recommendationsSection =
    el("recommendationsSection");

const recommendationsList =
    el("recommendationsList");


const congratulationsSection =
    el("congratulationsSection");

const congratulationsList =
    el("congratulationsList");


const addRecommendationSection =
    el("addRecommendationSection");

const addCongratulationsSection =
    el("addCongratulationsSection");


const recommendationForm =
    el("recommendationForm");

const recommendationName =
    el("recommendationName");

const recommendationText =
    el("recommendationText");

const saveRecommendationButton =
    el("saveRecommendationButton");


const congratulationForm =
    el("congratulationForm");

const congratulationName =
    el("congratulationName");

const congratulationText =
    el("congratulationText");

const saveCongratulationButton =
    el("saveCongratulationButton");


/* 
   Helper functions
    */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            (c) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[c]
        );
}


function formatDate(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleDateString(
        "ar-EG",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
}


function formatDateTime(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleString(
        "ar-EG"
    );
}


function clearTemporaryPassword() {

    tempPassword = null;

    tempExpiresAt = null;
}




function isNewStudent(student) {

    if (
        !student ||
        !student.created_at
    ) {
        return false;
    }

    const createdDate =
        new Date(
            student.created_at
        );

    if (
        Number.isNaN(
            createdDate.getTime()
        )
    ) {
        return false;
    }

    const now =
        new Date();


    

    const todayStart =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0,
            0
        );


   

    const yesterdayStart =
        new Date(
            todayStart
        );

    yesterdayStart.setDate(
        yesterdayStart.getDate() - 1
    );


   

    return (
        createdDate >=
        yesterdayStart
    );
}


/* 
   Notice
    */

function showNotice(
    message,
    options = {}
) {

    const {
        title = "تنبيه",
        confirmText = "حسنًا",
        showCancel = false,
        input = false
    } = options;


    noticeTitle.textContent =
        title;

    noticeMessage.textContent =
        message;

    noticeConfirm.textContent =
        confirmText;


    noticeCancel.style.display =
        showCancel
            ? "flex"
            : "none";


    noticeInput.style.display =
        input
            ? "block"
            : "none";


    noticeInput.value =
        "";


    noticeIcon.innerHTML =
        '<i class="fa-solid fa-circle-info"></i>';


    noticeModal.classList.add(
        "active"
    );


    if (input) {
        noticeInput.focus();
    }


    return new Promise(
        (resolve) => {

            const finish =
                (value) => {

                    noticeModal.classList.remove(
                        "active"
                    );


                    noticeConfirm.removeEventListener(
                        "click",
                        onConfirm
                    );


                    noticeCancel.removeEventListener(
                        "click",
                        onCancel
                    );


                    closeNotice.removeEventListener(
                        "click",
                        onClose
                    );


                    noticeModal.removeEventListener(
                        "click",
                        onOutside
                    );


                    resolve(value);
                };


            const onConfirm =
                () => {

                    finish(
                        input
                            ? noticeInput.value
                            : true
                    );
                };


            const onCancel =
                () => {

                    finish(
                        showCancel
                            ? false
                            : null
                    );
                };


            const onClose =
                () => {

                    finish(
                        showCancel
                            ? false
                            : null
                    );
                };


            const onOutside =
                (event) => {

                    if (
                        event.target ===
                        noticeModal
                    ) {

                        finish(
                            showCancel
                                ? false
                                : null
                        );
                    }
                };


            noticeConfirm.addEventListener(
                "click",
                onConfirm
            );


            noticeCancel.addEventListener(
                "click",
                onCancel
            );


            closeNotice.addEventListener(
                "click",
                onClose
            );


            noticeModal.addEventListener(
                "click",
                onOutside
            );

        }
    );
}


function showAlert(
    message,
    title = "تنبيه"
) {

    return showNotice(
        message,
        {
            title,
        }
    );
}


async function showPrompt(
    message,
    title = "كلمة المرور"
) {

    return showNotice(
        message,
        {
            title: title,

            confirmText:
                "تحقق",

            input:
                true,
        }
    );
}

async function requestRecommendationPassword() {

    const password =
        await showPrompt(
            "أدخلي كلمة المرور الدائمة للتوصية.",
            "كلمة مرور التوصيات"
        );

    if (!password) {
        return null;
    }

    const cleanPassword =
        password.trim();

    if (!cleanPassword) {

        showAlert(
            "يرجى إدخال كلمة المرور."
        );

        return null;
    }

    return cleanPassword;
}


/* 
   Login state
    */

function updateAuthUI() {

    loginButton.style.display =
        isTeacherLoggedIn
            ? "none"
            : "flex";


    logoutButton.style.display =
        isTeacherLoggedIn
            ? "flex"
            : "none";


    generatePasswordButton.style.display =
        isTeacherLoggedIn
            ? "flex"
            : "none";
}


db.auth.onAuthStateChange(
    (
        _event,
        session
    ) => {

        isTeacherLoggedIn =
            !!session;


        if (!session) {

            clearTemporaryPassword();
        }


        updateAuthUI();
    }
);


/* 
   Login / logout
    */

function openLoginModal() {

    loginError.textContent =
        "";

    loginModal.classList.add(
        "active"
    );

    loginEmail.focus();
}


function closeLoginModal() {

    loginModal.classList.remove(
        "active"
    );

    loginForm.reset();

    loginError.textContent =
        "";
}


async function teacherLogin(
    event
) {

    event.preventDefault();

    submitLogin.disabled =
        true;

    loginError.textContent =
        "";


    const {
        error
    } =
        await db.auth.signInWithPassword(
            {
                email:
                    loginEmail.value.trim(),

                password:
                    loginPassword.value,
            }
        );


    if (error) {

        console.error(
            "teacherLogin error:",
            error
        );

        loginError.textContent =
            "بيانات تسجيل الدخول غير صحيحة.";

        submitLogin.disabled =
            false;

        return;
    }


    isTeacherLoggedIn =
        true;


    updateAuthUI();

    closeLoginModal();

    submitLogin.disabled =
        false;
}


async function sendPasswordReset() {

    const email =
        loginEmail.value.trim();


    if (
        !email ||
        !loginEmail.checkValidity()
    ) {

        loginError.textContent =
            "أدخلي البريد الإلكتروني الصحيح أولًا.";

        loginEmail.focus();

        return;
    }


    forgotPassword.disabled =
        true;


    loginError.textContent =
        "جارٍ إرسال رابط إعادة التعيين...";


    const {
        error
    } =
        await db.auth.resetPasswordForEmail(
            email,
            {
                redirectTo:
                    window.location.href,
            }
        );


    if (error) {

        console.error(
            "sendPasswordReset error:",
            error
        );

        loginError.textContent =
            "تعذر إرسال الرابط. تأكدي من البريد وحاولي مرة أخرى.";

    } else {

        loginError.textContent =
            "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.";
    }


    forgotPassword.disabled =
        false;
}


async function teacherLogout() {

    const {
        error
    } =
        await db.auth.signOut();


    if (error) {

        console.error(
            "teacherLogout error:",
            error
        );
    }


    isTeacherLoggedIn =
        false;


    clearTemporaryPassword();

    updateAuthUI();


    showAlert(
        "تم تسجيل الخروج.",
        "تم بنجاح"
    );
}


/* 
   Temporary password
    */

async function requestTemporaryPassword(
    forceNewCheck = false
) {


    if (
        !forceNewCheck &&
        tempPassword &&
        tempExpiresAt &&
        new Date(
            tempExpiresAt
        ) > new Date()
    ) {

        return tempPassword;
    }


    clearTemporaryPassword();


    const password =
        await showPrompt(
            "أدخلي كلمة المرور المؤقتة التي أعطتكِ إياها الأستاذة عايشة:"
        );


    if (!password) {

        return null;
    }


    const cleanPassword =
        password.trim();


    if (!cleanPassword) {

        showAlert(
            "يرجى إدخال كلمة المرور المؤقتة."
        );

        return null;
    }


    const {
        data,
        error
    } =
        await db.rpc(
            "verify_temporary_password",
            {
                p_password:
                    cleanPassword,
            }
        );


    if (error) {

        console.error(
            "verify_temporary_password error:",
            error
        );

        showAlert(
            "تعذر الاتصال بالخادم للتحقق من كلمة المرور."
        );

        return null;
    }


    if (
        !data ||
        !data.success
    ) {

        showAlert(
            (
                data &&
                data.message
            ) ||
            "كلمة المرور غير صحيحة أو منتهية الصلاحية."
        );

        return null;
    }


    tempPassword =
        cleanPassword;


    tempExpiresAt =
        data.expiresAt;


    return tempPassword;
}


async function generateTemporaryPassword() {

    if (!isTeacherLoggedIn) {

        showAlert(
            "يجب على الأستاذة عايشة تسجيل الدخول أولًا."
        );

        return;
    }


    const {
        data,
        error
    } =
        await db.rpc(
            "create_temporary_password"
        );


    if (error) {

        console.error(
            "create_temporary_password error:",
            error
        );

        showAlert(
            "تعذر توليد كلمة المرور المؤقتة."
        );

        return;
    }


    if (
        !data ||
        !data.success
    ) {

        showAlert(
            (
                data &&
                data.message
            ) ||
            "تعذر توليد كلمة المرور."
        );

        return;
    }


    tempPassword =
        data.temporaryPassword;


    tempExpiresAt =
        data.expiresAt;


    showAlert(

        "كلمة المرور المؤقتة:\n\n" +

        data.temporaryPassword +

        "\n\nصالحة حتى:\n" +

        formatDateTime(
            data.expiresAt
        ),

        "تم التوليد بنجاح"

    );
}


/* 
   Student form
    */

function openModal(student) {

    if (student) {

        modalTitle.textContent =
            "تعديل بيانات الطالبة";


        el("studentId").value =
            student.id;


        el("studentName").value =
            student.name || "";


        el("nationality").value =
            student.nationality || "";


        el("completionDate").value =
            student.completion_date || "";


        const completionRadio =
            document.querySelector(
                'input[name="completionType"][value="' +
                (
                    student.completion_type ===
                    "review"
                        ? "review"
                        : "memorization"
                ) +
                '"]'
            );


        if (completionRadio) {

            completionRadio.checked =
                true;
        }

    } else {

        modalTitle.textContent =
            "إضافة خاتمة جديدة";


        studentForm.reset();


        el("studentId").value =
            "";


        const memorizationRadio =
            document.querySelector(
                'input[name="completionType"][value="memorization"]'
            );


        if (memorizationRadio) {

            memorizationRadio.checked =
                true;
        }
    }


    modal.classList.add(
        "active"
    );
}


function closeModal() {

    modal.classList.remove(
        "active"
    );
}


/* 
   Add / edit / delete
    */

async function editStudent(
    student
) {

    if (!isTeacherLoggedIn) {

     

        if (
            !isNewStudent(student)
        ) {

            showAlert(

                "لا يمكنك تعديل هذه الطالبة.\n\n" +

                "يمكنك فقط تعديل سجل جديد " +

                "تم إنشاؤه من أمس وحتى الآن."

            );

            return;
        }


        const password =
            await requestTemporaryPassword();


        if (!password) {

            return;
        }
    }


    openModal(student);
}


async function submitForm(
    event
) {

    event.preventDefault();


    const studentId =
        el("studentId").value;


    const name =
        el("studentName")
            .value
            .trim();


    const nationality =
        el("nationality")
            .value
            .trim();


    const completionDate =
        el("completionDate")
            .value ||
        null;


    const completionType =
        document.querySelector(
            'input[name="completionType"]:checked'
        )?.value;


    if (
        !name ||
        !nationality
    ) {

        showAlert(
            "يرجى تعبئة اسم الطالبة والجنسية."
        );

        return;
    }


    let password =
        null;


    if (!isTeacherLoggedIn) {

        password =
            await requestTemporaryPassword();


        if (!password) {

            return;
        }
    }


    saveButton.disabled =
        true;


    const {
        data,
        error
    } =
        await db.rpc(
            "manage_student",
            {

                p_action:
                    studentId
                        ? "update"
                        : "add",

                p_student_id:
                    studentId
                        ? Number(studentId)
                        : null,

                p_name:
                    name,

                p_nationality:
                    nationality,

                p_completion_date:
                    completionDate,

                p_completion_type:
                    completionType,

                p_temporary_password:
                    password,
            }
        );


    saveButton.disabled =
        false;


    if (error) {

        console.error(
            "manage_student error:",
            error
        );

        showAlert(
            "تعذر الاتصال بالخادم."
        );

        return;
    }


    if (
        !data ||
        !data.success
    ) {

        showAlert(
            (
                data &&
                data.message
            ) ||
            "تعذر حفظ بيانات الطالبة."
        );

        return;
    }


    closeModal();

    await loadStudents();
}


async function deleteStudent(
    student
) {

    const confirmed =
        await showNotice(

            'هل أنتِ متأكدة من حذف سجل الطالبة "' +
            student.name +
            '"؟',

            {
                title:
                    "تأكيد الحذف",

                confirmText:
                    "حذف",

                showCancel:
                    true
            }
        );


    if (!confirmed) {

        return;
    }


    let password =
        null;


    if (!isTeacherLoggedIn) {

       

        if (
            !isNewStudent(student)
        ) {

            showAlert(

                "لا يمكنك حذف هذه الطالبة.\n\n" +

                "يمكن فقط حذف السجلات الجديدة " +

                "التي تم إنشاؤها من أمس وحتى الآن."

            );

            return;
        }


        password =
            await requestTemporaryPassword();


        if (!password) {

            return;
        }
    }


    const {
        data,
        error
    } =
        await db.rpc(
            "manage_student",
            {

                p_action:
                    "delete",

                p_student_id:
                    Number(student.id),

                p_temporary_password:
                    password,
            }
        );


    if (error) {

        console.error(
            "deleteStudent error:",
            error
        );

        showAlert(
            "تعذر الاتصال بالخادم."
        );

        return;
    }


    if (
        !data ||
        !data.success
    ) {

        showAlert(
            (
                data &&
                data.message
            ) ||
            "تعذر حذف الطالبة."
        );

        return;
    }


    await loadStudents();
}


/* 
   Student details
    */



function openStudentDetails(
    student,
    mode
) {

    selectedStudent =
        student;


    selectedDetailsMode =
        mode;


   

    if (
        !isNewStudent(student)
    ) {

        showAlert(
            "التوصيات والتهاني متاحة فقط للسجلات الجديدة."
        );

        return;
    }


    studentDetailsName.textContent =
        student.name ||
        "اسم الطالبة";


    studentDetailsSubtitle.textContent =

        (
            student.completion_type ===
            "review"

                ? "خاتمة مراجعة"

                : "خاتمة حفظ"

        ) +

        " — حاملات المسك";



    if (recommendationsSection) {

        recommendationsSection.style.display =
            "none";
    }


    if (congratulationsSection) {

        congratulationsSection.style.display =
            "none";
    }


    if (addRecommendationSection) {

        addRecommendationSection.style.display =
            "none";
    }


    if (addCongratulationsSection) {

        addCongratulationsSection.style.display =
            "none";
    }


   

    if (recommendationForm) {

        recommendationForm.reset();
    }


    if (congratulationForm) {

        congratulationForm.reset();
    }


   

    if (
        mode ===
        "recommendations"
    ) {

        renderRecommendations(
            student
        );


        if (
            isNewStudent(student) &&
            addRecommendationSection
        ) {

            addRecommendationSection.style.display =
                "block";
        }
    }


   

    if (
        mode ===
        "congratulations"
    ) {

        renderCongratulations(
            student
        );


        if (
            isNewStudent(student) &&
            addCongratulationsSection
        ) {

            addCongratulationsSection.style.display =
                "block";
        }
    }


    studentDetailsModal.classList.add(
        "active"
    );
}


function closeStudentDetailsModal() {

    studentDetailsModal.classList.remove(
        "active"
    );


    selectedStudent =
        null;


    selectedDetailsMode =
        null;
}




function normalizeItems(
    value
) {

    if (
        !Array.isArray(value)
    ) {

        return [];
    }


    return value.filter(
        (item) => {

            return (
                item &&
                typeof item ===
                    "object"
            );
        }
    );
}


/* 
   Recommendations
    */

function renderRecommendations(
    student
) {

    const recommendations =
        normalizeItems(
            student.recommendations
        );


    recommendationsList.innerHTML =
        "";


    if (
        !recommendations.length
    ) {

        recommendationsSection.style.display =
            "block";


        recommendationsList.innerHTML =

            '<div class="details-empty">' +

                '<i class="fa-solid fa-quote-right"></i>' +

                "<p>لا توجد توصيات حتى الآن.</p>" +

            "</div>";

        return;
    }


    recommendationsSection.style.display =
        "block";


    recommendations.forEach(
        (item) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "details-card";


            card.innerHTML =

                '<div class="details-card-icon">' +

                    '<i class="fa-solid fa-quote-right"></i>' +

                "</div>" +

                '<div class="details-card-content">' +

                    "<strong>" +

                        escapeHtml(
                            item.name ||
                            "معلمة أو موجهة"
                        ) +

                    "</strong>" +

                    "<p>" +

                        escapeHtml(
                            item.text ||
                            ""
                        ) +

                    "</p>" +

                "</div>";


            recommendationsList.appendChild(
                card
            );
        }
    );
}


/* 
   Congratulations
    */

function renderCongratulations(
    student
) {

    const congratulations =
        normalizeItems(
            student.congratulations
        );


    congratulationsList.innerHTML =
        "";


    if (
        !congratulations.length
    ) {

        congratulationsSection.style.display =
            "block";


        congratulationsList.innerHTML =

            '<div class="details-empty">' +

                '<i class="fa-solid fa-gift"></i>' +

                "<p>لا توجد تهاني وتبريكات حتى الآن.</p>" +

            "</div>";

        return;
    }


    congratulationsSection.style.display =
        "block";


    congratulations.forEach(
        (item) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "details-card";


            card.innerHTML =

                '<div class="details-card-icon">' +

                    '<i class="fa-solid fa-heart"></i>' +

                "</div>" +

                '<div class="details-card-content">' +

                    "<strong>" +

                        escapeHtml(
                            item.name ||
                            "محبّة"
                        ) +

                    "</strong>" +

                    "<p>" +

                        escapeHtml(
                            item.text ||
                            ""
                        ) +

                    "</p>" +

                "</div>";


            congratulationsList.appendChild(
                card
            );
        }
    );
}


/* 
   Add recommendation
    */

async function addRecommendation(
    event
) {

    event.preventDefault();


    if (!selectedStudent) {

        return;
    }


  

    if (
        !isNewStudent(
            selectedStudent
        )
    ) {

        showAlert(
            "التوصيات متاحة فقط للسجلات الجديدة."
        );

        return;
    }


    const name =
        recommendationName
            .value
            .trim();


    const text =
        recommendationText
            .value
            .trim();


    if (
        !name ||
        !text
    ) {

        showAlert(
            "يرجى كتابة اسم المعلمة أو الموجهة ونص التوصية."
        );

        return;
    }


   
    if (
        name.length >
        50
    ) {

        showAlert(
            "اسم المعلمة أو الموجهة يجب ألا يتجاوز 50 حرفًا."
        );

        return;
    }


   

    if (
        text.length >
        150
    ) {

        showAlert(
            "نص التوصية يجب ألا يتجاوز 150 حرفًا."
        );

        return;
    }


    const recommendations =
        normalizeItems(
            selectedStudent.recommendations
        );


    if (
        recommendations.length >=
        3
    ) {

        showAlert(
            "لا يمكن إضافة أكثر من 3 توصيات لهذه الطالبة."
        );

        return;
    }


    /*
       
       Permanent recommendation password
       

    */

    const password =
        await requestRecommendationPassword();


    if (!password) {

        return;
    }


    saveRecommendationButton.disabled =
        true;


    

    const {
        data,
        error
    } =
        await db.rpc(
            "add_recommendation",
            {
                p_student_id:
                    Number(
                        selectedStudent.id
                    ),

                p_name:
                    name,

                p_text:
                    text,

                p_password:
                    password,
            }
        );


    saveRecommendationButton.disabled =
        false;


    if (error) {

        console.error(
            "addRecommendation error:",
            error
        );


        showAlert(
            error.message ||
            "تعذر إضافة التوصية."
        );

        return;
    }


    if (!data) {

        showAlert(
            "تعذر إضافة التوصية."
        );

        return;
    }


   

    selectedStudent =
        data;


    

    const index =
        students.findIndex(
            (student) =>
                student.id ===
                data.id
        );


    if (index !== -1) {

        students[index] =
            data;
    }


   

    renderRecommendations(
        data
    );


    recommendationForm.reset();


    showAlert(
        "تمت إضافة التوصية بنجاح.",
        "تم بنجاح"
    );
}


/* 
   Add congratulation
    */

async function addCongratulation(
    event
) {

    event.preventDefault();


    if (!selectedStudent) {

        return;
    }


   

    if (
        !isNewStudent(
            selectedStudent
        )
    ) {

        showAlert(
            "التهاني والتبريكات متاحة فقط للسجلات الجديدة."
        );

        return;
    }


    const name =
        congratulationName
            .value
            .trim();


    const text =
        congratulationText
            .value
            .trim();


    if (
        !name ||
        !text
    ) {

        showAlert(
            "يرجى كتابة اسم المهنئ ونص التهنئة."
        );

        return;
    }


   
    if (
        name.length >
        50
    ) {

        showAlert(
            "اسم المهنئ يجب ألا يتجاوز 50 حرفًا."
        );

        return;
    }


   

    if (
        text.length >
        150
    ) {

        showAlert(
            "نص التهنئة يجب ألا يتجاوز 150 حرفًا."
        );

        return;
    }


    const congratulations =
        normalizeItems(
            selectedStudent.congratulations
        );


   /*
    Recommendation password
*/

saveCongratulationButton.disabled =
        true;


   

    const {
        data,
        error
    } =
        await db.rpc(
            "add_congratulation",
            {
                p_student_id:
                    Number(
                        selectedStudent.id
                    ),

                p_name:
                    name,

                p_text:
                    text,
            }
        );


    saveCongratulationButton.disabled =
        false;


    if (error) {

        console.error(
            "addCongratulation error:",
            error
        );


        showAlert(
            error.message ||
            "تعذر إضافة التهنئة."
        );

        return;
    }


    if (!data) {

        showAlert(
            "تعذر إضافة التهنئة."
        );

        return;
    }


  

    selectedStudent =
        data;


   

    const index =
        students.findIndex(
            (student) =>
                student.id ===
                data.id
        );


    if (index !== -1) {

        students[index] =
            data;
    }


   

    renderCongratulations(
        data
    );


    congratulationForm.reset();


    showAlert(
        "تمت إضافة التهنئة والتبريك بنجاح.",
        "تم بنجاح"
    );
}


/* 
   Load students
    */

async function loadStudents() {

    const {
        data,
        error
    } =
        await db.from(
            "students"
        )
            .select("*")
            .order(
                "created_at",
                {
                    ascending:
                        false,
                }
            );

    console.log("loadStudents response:", {
        count: Array.isArray(data) ? data.length : 0,
        data,
        error,
    });

    if (error) {

        console.error(
            "loadStudents error:",
            error
        );

        students = [];
        render();

        showAlert(
            "تعذر تحميل بيانات الطالبات من قاعدة البيانات."
        );

        return;
    }

    students = Array.isArray(data)
        ? data
        : [];

    render();
}


/* 
   Display students
    */

function render() {

    const term =
        searchInput.value
            .trim()
            .toLowerCase();


    const sort =
        sortSelect.value;


    let list =
        students.filter(
            (s) =>
                String(
                    s.name || ""
                )
                    .toLowerCase()
                    .includes(term)
        );


    if (
        sort ===
        "newest"
    ) {

        list.sort(
            (a, b) =>
                new Date(
                    b.created_at
                ) -
                new Date(
                    a.created_at
                )
        );

    } else if (
        sort ===
        "oldest"
    ) {

        list.sort(
            (a, b) =>
                new Date(
                    a.created_at
                ) -
                new Date(
                    b.created_at
                )
        );

    } else if (
        sort ===
        "name"
    ) {

        list.sort(
            (a, b) =>
                String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    ),
                    "ar"
                )
        );
    }


    const memorization =
        list.filter(
            (s) =>
                s.completion_type ===
                "memorization"
        );


    const review =
        list.filter(
            (s) =>
                s.completion_type ===
                "review"
        );


    const totalMemorization =
        students.filter(
            (s) =>
                s.completion_type ===
                "memorization"
        ).length;


    const totalReview =
        students.filter(
            (s) =>
                s.completion_type ===
                "review"
        ).length;


    el(
        "memorizationCount"
    ).textContent =
        totalMemorization;


    el(
        "reviewCount"
    ).textContent =
        totalReview;


    el(
        "memorizationTableCount"
    ).textContent =
        totalMemorization;


    el(
        "reviewTableCount"
    ).textContent =
        totalReview;


    fillTable(
        "memorizationTable",
        "memorizationEmpty",
        memorization
    );


    fillTable(
        "reviewTable",
        "reviewEmpty",
        review
    );
}


/* 
   Fill tables
    */

function fillTable(
    tableId,
    emptyId,
    rows
) {

    const tbody =
        el(tableId);


    const empty =
        el(emptyId);


    tbody.innerHTML =
        "";


    empty.style.display =
        rows.length
            ? "none"
            : "block";


    rows.forEach(
        (student, index) => {

            const tr =
                document.createElement(
                    "tr"
                );



            const newStudent =
                isNewStudent(
                    student
                );


          

            const extraButtons =
                newStudent

                    ? (

                        '<button class="action-btn recommendation-btn" ' +
                        'type="button" ' +
                        'title="التوصيات">' +

                            '<i class="fa-solid fa-quote-right"></i>' +

                        '</button>' +


                        '<button class="action-btn congratulations-btn" ' +
                        'type="button" ' +
                        'title="التهاني والتبريكات">' +

                            '<i class="fa-solid fa-gift"></i>' +

                        '</button>'

                    )

                    : "";


            tr.innerHTML =

                "<td>" +

                    (index + 1) +

                "</td>" +


                "<td>" +

                    "<strong>" +

                        escapeHtml(
                            student.name
                        ) +

                    "</strong>" +

                "</td>" +


                "<td>" +

                    escapeHtml(
                        student.nationality
                    ) +

                "</td>" +


                "<td>" +

                    escapeHtml(
                        formatDate(
                            student.completion_date
                        )
                    ) +

                "</td>" +


                "<td>" +

                    '<div class="action-buttons">' +


                       

                        '<button class="action-btn edit-btn" ' +
                        'type="button" ' +
                        'title="تعديل">' +

                            '<i class="fa-solid fa-pen"></i>' +

                        "</button>" +


                      

                        '<button class="action-btn delete-btn" ' +
                        'type="button" ' +
                        'title="حذف">' +

                            '<i class="fa-solid fa-trash"></i>' +

                        "</button>" +


                        

                        extraButtons +


                    "</div>" +

                "</td>";


           

            const editButton =
                tr.querySelector(
                    ".edit-btn"
                );


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    () =>
                        editStudent(
                            student
                        )
                );
            }


            const deleteButton =
                tr.querySelector(
                    ".delete-btn"
                );


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    () =>
                        deleteStudent(
                            student
                        )
                );
            }


            

            const recommendationButton =
                tr.querySelector(
                    ".recommendation-btn"
                );


            if (
                recommendationButton
            ) {

                recommendationButton.addEventListener(
                    "click",
                    () =>
                        openStudentDetails(
                            student,
                            "recommendations"
                        )
                );
            }


          

            const congratulationsButton =
                tr.querySelector(
                    ".congratulations-btn"
                );


            if (
                congratulationsButton
            ) {

                congratulationsButton.addEventListener(
                    "click",
                    () =>
                        openStudentDetails(
                            student,
                            "congratulations"
                        )
                );
            }


            tbody.appendChild(
                tr
            );
        }
    );
}


/* 
   Events
    */

loginButton.addEventListener(
    "click",
    openLoginModal
);


loginForm.addEventListener(
    "submit",
    teacherLogin
);


forgotPassword.addEventListener(
    "click",
    sendPasswordReset
);


el("closeLoginModal")
    .addEventListener(
        "click",
        closeLoginModal
    );


el("cancelLogin")
    .addEventListener(
        "click",
        closeLoginModal
    );


loginModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            loginModal
        ) {

            closeLoginModal();
        }
    }
);


logoutButton.addEventListener(
    "click",
    teacherLogout
);


generatePasswordButton.addEventListener(
    "click",
    generateTemporaryPassword
);


addButton.addEventListener(
    "click",
    () =>
        openModal(null)
);


el("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


el("cancelModal")
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            modal
        ) {

            closeModal();
        }
    }
);


/* 
   Student details
    */

if (closeStudentDetails) {

    closeStudentDetails.addEventListener(
        "click",
        closeStudentDetailsModal
    );
}


if (studentDetailsModal) {

    studentDetailsModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                studentDetailsModal
            ) {

                closeStudentDetailsModal();
            }
        }
    );
}


/* 
   Recommendation form
    */

if (recommendationForm) {

    recommendationForm.addEventListener(
        "submit",
        addRecommendation
    );
}


/* 
   Congratulation form
    */

if (congratulationForm) {

    congratulationForm.addEventListener(
        "submit",
        addCongratulation
    );
}


/* 
   Character limits
    */



if (recommendationText) {

    recommendationText.maxLength =
        150;
}


if (congratulationText) {

    congratulationText.maxLength =
        150;
}


if (recommendationName) {

    recommendationName.maxLength =
        150;
}


if (congratulationName) {

    congratulationName.maxLength =
        150;
}


/* 
   Search / sort
    */

searchInput.addEventListener(
    "input",
    render
);


sortSelect.addEventListener(
    "change",
    render
);


/* 
   Student form
    */

studentForm.addEventListener(
    "submit",
    submitForm
);


/* 
   Start app
    */

(async function init() {

    const {
        data
    } =
        await db.auth.getSession();


    isTeacherLoggedIn =
        !!data.session;


    updateAuthUI();


    await loadStudents();

})();
