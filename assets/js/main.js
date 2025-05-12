import {
    Form, Notify, siteForm, TextINput, confirmDeleteBtn, updatetableData, submitFormBtn, datatable, deletebtn,
    handleDeleteRequest, updatetableDataStatus, previewImage, updateuserProject, updateusereducation,
    updateuserexperience
} from './variable.js'
import Fetch from './fetch.js'

const apiInput = document.querySelector('#endapi')
const ImageInput = document.querySelector('#pimage')

if (document.querySelector("#datatable")) $("#datatable").DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "responsive": true,
})

if ($('#summernote')) $('#summernote').summernote({
    height: 300, // Set editor height
    tooltip: false,
    toolbar: [
        // [groupName, [list of button]]
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['link',]],
        ['view', ['fullscreen', 'codeview', 'help']]
    ],
})

window.onload = () => {
    if (window.location.pathname === '/dashboard') Notify({ success: 'Welcome to HireNest' })
}

document.onclick = (e) => {
    if (e.target.closest('.btn.btn-primary.float-end') &&
        e.target.type === 'button' &&
        e.target.dataset.bsTarget == '#modal' &&
        e.target.dataset.bsToggle == 'modal'
    ) {
        Form.id = 'submitForm';
        const form = document.getElementById('submitForm')
        const inputs = form.querySelectorAll('input')

        inputs.forEach(input => input.value = null)
        return TextINput.value = null
    }
}

document.onclick = (e) => {
    if (e.target.closest('.signup-btn.btn-1') &&
        e.target.type === 'submit' &&
        e.target.dataset.bsToggle == 'modal'
    ) {
        Form.id = 'submitForm';
        const form = document.getElementById('submitForm')
        const inputs = form.querySelectorAll('input')

        inputs.forEach(input => input.value = null)
        return TextINput.value = null
    }
}

if (document.querySelector('#addproject')) document.getElementById('addproject').addEventListener('click', () => {
    const form = document.getElementById('submitForm');
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.value = null;
    })
})


if (datatable) datatable.onclick = (e) => {
    const endApi = `/${apiInput.value.trim()}/${e.target.dataset.id}`;
    const table_row = e.target.closest('.table-row')

    if (e.target.closest('.danger-modal')) openDangerModal(table_row, endApi)
    if (e.target.closest('.status')) updatetableDataStatus(e.target.checked, endApi)
    if (e.target.closest('.edit')) updatetableData(endApi)
    if (e.target.closest('.projectedit')) updateuserProject(endApi)
    if (e.target.closest('.educationedit')) updateusereducation(endApi)
    if (e.target.closest('.experienceedit')) updateuserexperience(endApi)
}

if (Form) Form.onsubmit = async (e) => {
    try {
        e.preventDefault()
        let res;
        submitFormBtn.disabled = true;
        submitFormBtn.innerHTML = 'Submitting...';

        const formdata = new FormData(e.target)
        Form.id === 'submitForm' // Handle Data Submission To Server
            ? res = await Fetch.post(`/${apiInput.value.trim()}`, formdata)
            : res = await Fetch.put(`/${apiInput.value.trim()}/${e.target.dataset?.id}`, formdata)

        Notify(res) // Notify Server Message
        if (res.success) setTimeout(() => { window.location.reload() }, 600)
    } catch (error) {
        console.error(error)
    } finally {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = 'Submit';
    }
}

const openDangerModal = (table_row, api) => {
    deletebtn.onclick = () => handleDeleteRequest(table_row, api)
    return;
}

if (confirmDeleteBtn) confirmDeleteBtn.onclick = async () => {
    try {
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.innerHTML = 'Deleting...';

        const res = Fetch.delete(`/${apiInput.value.trim()}`)

        Notify(res)
        if (res.success) { setTimeout(() => { window.location.reload() }, 600) }
    } catch (error) {
        console.error(error)
    } finally {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.innerHTML = 'Delete';
    }
}

if (siteForm) siteForm.onsubmit = async (e) => {
    try {
        e.preventDefault()
        submitFormBtn.disabled = true;
        submitFormBtn.innerHTML = 'Submitting...';
        let res;

        const formdata = new FormData(e.target)
        siteForm.id === 'updateFormSite'
            ? res = await Fetch.put(`/${apiInput.value.trim()}`, formdata)
            : res = await Fetch.patch(`/${apiInput.value.trim()}`, formdata, { patch: true })

        Notify(res) // Notify Server Message
        siteForm.id = 'updateFormSite';
        if (res.success) setTimeout(() => { window.location.reload() }, 600)
    } catch (error) {
        console.error(error)
    } finally {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = 'Submit';
    }
}

if (ImageInput) ImageInput.onchange = (e) => { previewImage(e) }

$('.select2').each(function () {
    const $select = $(this);
    const $modal = $select.closest('.modal');

    $select.select2({
        dropdownParent: $modal.length ? $modal : $(document.body)
    })
}) // Select 2 Initalization 

let controller = null;
let timeout = null;
$('#countrySelect').on('select2:open', function () {

    setTimeout(() => {
        const $searchField = $('.select2-container--open .select2-search__field')
        $searchField.off('input').on('input', async function () {
            const searchTerm = $(this).val()

            if (controller) controller.abort()

            controller = new AbortController()
            const countries = await Fetch.get(`/api/countries?q=${searchTerm}`, {}, controller.signal)
            $('#countrySelect').empty()

            // Add new options
            countries.forEach(cn => {
                const newOption = `<option value="${cn.isoCode}">${cn.name}</option>`;
                $('#countrySelect').append(newOption)
            })

            // Refresh Select2 dropdown
            $('#countrySelect').trigger('change')
        })
    }, 1000)
})

let country = null;
$('#countrySelect').on('change', function () {
    const selectedValue = $(this).val()  // Get selected value (e.g., country code)
    country = selectedValue;
    $.ajax({
        url: `/api/states?q=${selectedValue}`, // Replace with your actual endpoint
        method: 'GET',
        success: function (states) {
            // Clear old options
            $('#stateSelect').empty()

            // Add new options
            states.forEach(s => {
                const newOption = `<option value="${s.isoCode}">${s.name}</option>`;
                $('#stateSelect').append(newOption)
            })

            // Refresh Select2 dropdown
            $('#stateSelect').trigger('change')
        }
    })
})

$('#stateSelect').on('change', function () {
    const selectedValue = $(this).val()  // Get selected value (e.g., country code)
    $.ajax({
        url: `/api/cities?s=${selectedValue}&c=${country}`, // Replace with your actual endpoint
        method: 'GET',
        success: function (cities) {
            // Clear old options
            $('#citySelect').empty()

            // Add new options
            cities.forEach(c => {
                const newOption = `<option value="${c.name}">${c.name}</option>`;
                $('#citySelect').append(newOption)
            })

            // Refresh Select2 dropdown
            $('#citySelect').trigger('change')
        }
    })
})

$('#jobskills').on('select2:open', function () {
    let timeout;
    let controller;

    try {
        const $searchField = $('.select2-container--open .select2-search__field')

        $searchField.off('input keyup') // Remove any existing handlers first
        $searchField.on('input keyup', async function () {
            const searchTerm = $(this).val().trim()

            // Clear previous timeout and abort previous request
            if (timeout) clearTimeout(timeout)
            if (controller) controller.abort()

            timeout = setTimeout(async () => {
                controller = new AbortController()
                try {
                    const skills = await Fetch.get(`/api/job-skills?skill=${searchTerm}`, {}, controller.signal)
                    const selectedValue = $('#jobskills').val() || []

                    // Add new options
                    skills.forEach(skill => {
                        if (!selectedValue.includes(skill._id)) {
                            const newOption = `<option value="${skill._id}">${skill.name}</option>`;
                            $('#jobskills').append(newOption)
                        }
                    })
                    // Refresh Select2 dropdown
                    $('#jobskills').trigger('change')
                } catch (error) {
                    console.error('Error fetching skills:', error)
                }
            }, 300)
        })
    } catch (error) {
        console.error('Error in select2 open handler:', error)
    }
}).on('select2:select', function () {
    // Clear the search input after selection
    $('.select2-search__field').val('')
})