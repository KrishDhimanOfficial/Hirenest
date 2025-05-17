import {
    Form, Notify, siteForm, TextINput, confirmDeleteBtn, updatetableData, submitFormBtn, datatable, deletebtn,
    handleDeleteRequest, updatetableDataStatus, previewImage, updateuserProject, updateusereducation,
    updateuserexperience, MultiSelectInit, setDatatable, apiInput, updateFilter
} from './variable.js'
import Fetch from './fetch.js'
const ImageInput = document.querySelector('#pimage')

const setsetting = async () => {
    const res = await Fetch.get('/dashboard/api/general-settings')
    const companyNameElement = document.querySelector('.companyname');
    const contactElement = document.querySelector('.contact');
    const emailElement = document.querySelector('.email');
    const logoElements = document.querySelectorAll('.logo');
    const faviconElement = document.querySelector('.favicon');

    if (companyNameElement) companyNameElement.innerHTML = res.companyname;
    if (contactElement) contactElement.innerHTML = res.contact;
    if (emailElement) emailElement.innerHTML = res.companyemail;
    if (logoElements.length > 0) {
        logoElements.forEach(img => img.src = `/uploads/companylogo/${res.logo}`);
    }
    if (faviconElement) faviconElement.href = `/uploads/companylogo/${res.logo}`;
}
setsetting()

if (document.querySelector('#job-table')) {
    setDatatable()
    document.querySelector("#filter-field").addEventListener("change", updateFilter)
    document.querySelector("#filter-type").addEventListener("change", updateFilter)
    document.querySelector("#filter-value").addEventListener("keyup", updateFilter)
}

if (document.querySelector("#datatable")) $("#datatable").DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "responsive": true,
})

$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 100000,
        values: [
            document.querySelector('#salarymin')?.value ?? 0,
            document.querySelector('#salarymax')?.value ?? 100000
        ],
        slide: function (event, ui) {
            $("#amount").val('₹' + ui.values[0] + " - " + ui.values[1]);
            // Update the displayed values
            $("#min-value").text('₹' + ui.values[0]);
            $("#max-value").text('₹' + ui.values[1]);
        }
    });

    // Set initial values
    $("#amount").val($("#slider-range").slider("values", 0) +
        " - " + $("#slider-range").slider("values", 1));
    $("#min-value").text($("#slider-range").slider("values", 0));
    $("#max-value").text($("#slider-range").slider("values", 1));
})

if ($('#summernote')) $('#summernote').summernote({
    height: 600, // Set editor height
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
if ($('#summernote2')) $('#summernote2').summernote({
    height: 600, // Set editor height
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
        dropdownParent: $modal.length ? $modal : $(document.body),
        placeholder: 'Select an option'
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

$('#categorySelect').on('select2:open', function () {
    let controller;
    let timeout;

    const $searchField = $('.select2-container--open .select2-search__field');

    $searchField.off('input').on('input', function () {
        const searchTerm = $(this).val().trim()

        if (controller) controller.abort()
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(async () => {
            controller = new AbortController()

            try {
                const industryId = $('#jobtindustries').val()
                const categories = await Fetch.get(
                    `/api/job-categories?category=${encodeURIComponent(searchTerm)}&industryId=${industryId}`,
                    {},
                    controller.signal
                );

                const selected = $('#categorySelect').val()

                $('#categorySelect').empty()

                categories.forEach(category => {
                    const option = new Option(category.name, category._id, false, selected === category._id)
                    $('#categorySelect').append(option)
                });

                $('#categorySelect').trigger('change.select2');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                }
            }
        }, 300)
    })
})
$('#jobDegree').on('select2:open', function () {
    let controller;
    let timeout;

    const $searchField = $('.select2-container--open .select2-search__field');

    $searchField.off('input').on('input', function () {
        const searchTerm = $(this).val().trim()

        if (controller) controller.abort()
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(async () => {
            controller = new AbortController()

            try {
                const degrees = await Fetch.get(
                    `/api/job-degrees?degree=${encodeURIComponent(searchTerm)}`,
                    {},
                    controller.signal
                );

                const selected = $('#jobDegree').val()

                $('#jobDegree').empty()

                degrees.forEach(degree => {
                    const option = new Option(degree.name, degree._id, false, selected === degree._id)
                    $('#jobDegree').append(option)
                });

                $('#jobDegree').trigger('change.select2')
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                }
            }
        }, 300)
    })
})

MultiSelectInit('#jobskills', '/api/job-skills?skill')
MultiSelectInit('#jobTags', '/api/job-tags?tag')

// Doughnut Chart
var donutChartCanvas = $('#donutChart').get(0).getContext('2d')
var donutData = {
    labels: [
        'Recuiters',
        'Users',
        'Job Seekers',
    ],
    datasets: [
        {
            data: [
                parseInt($('.totalrecuriters').val()),
                parseInt($('.totalusers').val()),
                parseInt($('.totalcandidates').val())
            ],
            backgroundColor: ['#f56954', '#00a65a', '#f39c12',],
        }
    ]
}

var donutOptions = {
    maintainAspectRatio: false,
    responsive: true,
}

new Chart(donutChartCanvas, {
    type: 'doughnut',
    data: donutData,
    options: donutOptions
})

// Line chart
const signups = JSON.parse($('.totalSignups').val())
var labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Initialize data array with 0s
var signupData = new Array(labels.length).fill(0)

// Fill in the signup counts in the correct month index
signups.forEach(signup => {
    const monthIndex = signup._id.month - 1; // Convert 1-based month to 0-based index
    if (monthIndex >= 0 && monthIndex < labels.length) {
        signupData[monthIndex] = signup.count;
    }
})

var areaChartData = {
    labels,
    datasets: [
        {
            label: 'Digital Goods',
            backgroundColor: 'rgba(60,141,188,0.9)',
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bba',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: signupData
        },
    ]
}

var areaChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: { display: false },
    scales: {
        xAxes: [{
            gridLines: { display: false }
        }],
        yAxes: [{
            gridLines: { display: false }
        }]
    }
}


//-------------
//- LINE CHART -
//--------------
var lineChartCanvas = $('#lineChart').get(0).getContext('2d')
var lineChartOptions = $.extend(true, {}, areaChartOptions)
var lineChartData = $.extend(true, {}, areaChartData)
lineChartData.datasets[0].fill = false;
lineChartOptions.datasetFill = false

new Chart(lineChartCanvas, {
    type: 'line',
    data: lineChartData,
    options: lineChartOptions
})