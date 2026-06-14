/* ==========================================================================
   AURABIODATA APPLICATION JS CONTROLLER - MOBILE-ONLY WIZARD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Main State Model
    const biodata = {
        photo: "assets/default_avatar.png",
        accentColor: "#b8860b",
        fontFamily: "heritage",
        template: "heritage",
        sections: [
            {
                id: "personal",
                title: "Personal Details",
                icon: "fa-user",
                fields: [
                    { id: "name", label: "Full Name", value: "Rahul Sharma", isDefault: true, required: true },
                    { id: "dob", label: "Date of Birth", value: "1996-08-15", isDefault: true, type: "date" },
                    { id: "birth_time", label: "Time of Birth", value: "08:45", isDefault: true, type: "time" },
                    { id: "birth_place", label: "Place of Birth", value: "Jaipur, Rajasthan", isDefault: true },
                    { id: "height", label: "Height", value: "5' 10\"", isDefault: true },
                    { id: "religion", label: "Religion / Caste", value: "Hindu, Brahmin", isDefault: true },
                    { id: "gothra", label: "Gotra", value: "Kashyap", isDefault: true },
                    { id: "rashi", label: "Rashi (Zodiac)", value: "Simha (Leo)", isDefault: true },
                    { id: "nakshatra", label: "Nakshatra", value: "Purva Phalguni", isDefault: true },
                    { id: "blood_group", label: "Blood Group", value: "O +ve", isDefault: true }
                ]
            },
            {
                id: "education_career",
                title: "Education & Career",
                icon: "fa-graduation-cap",
                fields: [
                    { id: "education", label: "Education", value: "B.Tech in Computer Science", isDefault: true },
                    { id: "occupation", label: "Occupation", value: "Senior Software Engineer", isDefault: true },
                    { id: "employer", label: "Employer", value: "Google Bengaluru", isDefault: true },
                    { id: "income", label: "Annual Income", value: "₹24 Lakhs Per Annum", isDefault: true }
                ]
            },
            {
                id: "family",
                title: "Family Details",
                icon: "fa-people-roof",
                fields: [
                    { id: "father", label: "Father's Details", value: "Mr. Suresh Sharma (Retired Executive Engineer)", isDefault: true },
                    { id: "mother", label: "Mother's Details", value: "Mrs. Sunita Sharma (Homemaker)", isDefault: true },
                    { id: "siblings", label: "Siblings", value: "1 Sister (Settled), 1 Brother (Studying)", isDefault: true },
                    { id: "native", label: "Family Native", value: "Udaipur, Rajasthan", isDefault: true },
                    { id: "family_status", label: "Family Status", value: "Upper Middle Class", isDefault: true }
                ]
            },
            {
                id: "contact",
                title: "Contact Details",
                icon: "fa-address-book",
                fields: [
                    { id: "phone", label: "Phone", value: "+91 98765 43210", isDefault: true },
                    { id: "email", label: "Email", value: "rahul.sharma@gmail.com", isDefault: true },
                    { id: "address", label: "Address", value: "Flat 402, Golden Heights, Vaishali Nagar, Jaipur - 302021", isDefault: true }
                ]
            }
        ]
    };

    // Deep copy of initial state for sample data populating
    const sampleSections = JSON.parse(JSON.stringify(biodata.sections));

    // DOM Panel References
    const dynamicFormContainer = document.getElementById('dynamic-form-container');
    const biodataSheet = document.getElementById('biodata-sheet');
    const modalBiodataSheet = document.getElementById('modal-biodata-sheet');

    // Step View Tab Pages
    const editorStep1 = document.getElementById('editor-step-1');
    const editorStep2 = document.getElementById('editor-step-2');
    const editorStep3 = document.getElementById('wizard-showcase-view');
    const editorStep4 = document.getElementById('editor-step-4');

    // Overlay components
    const previewModalOverlay = document.getElementById('preview-modal-overlay');
    const customizerBottomSheet = document.getElementById('customizer-bottom-sheet');

    // Buttons
    const prevStepBtn = document.getElementById('prev-step-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const floatingPreviewBtn = document.getElementById('floating-preview-btn');
    const closePreviewModalBtn = document.getElementById('close-preview-modal-btn');
    const customizerDrawerTrigger = document.getElementById('customizer-drawer-trigger');
    const closeBottomSheetBtn = document.getElementById('close-bottom-sheet-btn');
    const loadSampleBtn = document.getElementById('load-sample-btn');
    const printBtn = document.getElementById('print-btn');

    // Customizer select elements
    const fontSelect = document.getElementById('font-family-select');
    const templateSwapperSelect = document.getElementById('template-swapper-select');
    const colorPresets = document.querySelectorAll('.color-preset');
    const customColorPicker = document.getElementById('custom-color-picker');
    const activeTemplateLabel = document.getElementById('active-template-name');

    // Photo elements
    const dropZone = document.getElementById('drop-zone');
    const photoInput = document.getElementById('photo-input');
    const photoPreviewContainer = document.getElementById('photo-preview-container');
    const uploadPreviewImg = document.getElementById('upload-preview-img');
    const removePhotoBtn = document.getElementById('remove-photo-btn');

    // Template default colors
    const defaultColors = {
        heritage: '#b8860b',
        minimal: '#6366f1',
        floral: '#db2777',
        navy: '#1b365d',
        vintage: '#2b2b2a'
    };

    let currentStep = 1; // 1: Details, 2: Photo, 3: Showcase, 4: Customize/Download

    /* ==========================================================================
       WIZARD STEP NAVIGATION ROUTING
       ========================================================================== */

    function switchStep(stepNum) {
        currentStep = stepNum;

        // 1. Update stepper progress bullets
        for (let i = 1; i <= 4; i++) {
            const indicator = document.getElementById(`step-indicator-${i}`);
            const line = document.getElementById(`step-line-${i}`);
            
            if (indicator) {
                if (i < stepNum) {
                    indicator.className = 'step-indicator completed';
                    if (line) line.className = 'step-line completed';
                } else if (i === stepNum) {
                    indicator.className = 'step-indicator active';
                    if (line) line.className = 'step-line';
                } else {
                    indicator.className = 'step-indicator';
                    if (line) line.className = 'step-line';
                }
            }
        }

        // 2. Toggle editor tabs
        editorStep1.classList.remove('active');
        editorStep2.classList.remove('active');
        editorStep3.classList.remove('active');
        editorStep4.classList.remove('active');

        if (stepNum === 1) {
            editorStep1.classList.add('active');
        } else if (stepNum === 2) {
            editorStep2.classList.add('active');
        } else if (stepNum === 3) {
            editorStep3.classList.add('active');
            renderShowcaseThumbnails();
        } else if (stepNum === 4) {
            editorStep4.classList.add('active');
            renderPreviews();
        }

        // Close drawer and modal
        previewModalOverlay.classList.remove('open');
        customizerBottomSheet.classList.remove('open');

        // 3. Show / Hide contextual floating preview FAB
        if (stepNum === 1 || stepNum === 2) {
            floatingPreviewBtn.style.display = 'flex';
        } else {
            floatingPreviewBtn.style.display = 'none';
        }

        // 4. Update footer navigation labels
        if (stepNum === 1) {
            prevStepBtn.style.visibility = 'hidden';
            customizerDrawerTrigger.style.display = 'none';
            nextStepBtn.style.display = 'inline-flex';
            nextStepBtn.innerHTML = 'Photo <i class="fa-solid fa-chevron-right"></i>';
        } else if (stepNum === 2) {
            prevStepBtn.style.visibility = 'visible';
            customizerDrawerTrigger.style.display = 'none';
            nextStepBtn.style.display = 'inline-flex';
            nextStepBtn.innerHTML = 'Designs <i class="fa-solid fa-chevron-right"></i>';
        } else if (stepNum === 3) {
            prevStepBtn.style.visibility = 'visible';
            customizerDrawerTrigger.style.display = 'none';
            nextStepBtn.style.display = 'none'; // User must select a card design to go forward
        } else if (stepNum === 4) {
            prevStepBtn.style.visibility = 'visible';
            customizerDrawerTrigger.style.display = 'inline-flex';
            nextStepBtn.style.display = 'inline-flex';
            nextStepBtn.innerHTML = 'Download <i class="fa-solid fa-download"></i>';
        }

        // Recalculate scaling
        setTimeout(() => {
            scalePreview();
            scaleModalPreview();
        }, 80);
    }

    // Next button clicks
    nextStepBtn.addEventListener('click', () => {
        if (currentStep === 1) {
            switchStep(2);
        } else if (currentStep === 2) {
            switchStep(3);
        } else if (currentStep === 4) {
            downloadPDF();
        }
    });

    // Back button clicks
    prevStepBtn.addEventListener('click', () => {
        if (currentStep === 2) {
            switchStep(1);
        } else if (currentStep === 3) {
            switchStep(2);
        } else if (currentStep === 4) {
            switchStep(3);
        }
    });

    /* ==========================================================================
       DYNAMIC FORM EDITOR RENDERER
       ========================================================================== */

    function renderForm() {
        dynamicFormContainer.innerHTML = '';

        biodata.sections.forEach((section, sIndex) => {
            const card = document.createElement('div');
            card.className = 'form-category-card';

            const header = document.createElement('div');
            header.className = 'card-header';
            header.innerHTML = `<i class="fa-solid ${section.icon} icon-prefix"></i>${section.title}`;
            card.appendChild(header);

            const body = document.createElement('div');
            body.className = 'card-body';

            section.fields.forEach((field, fIndex) => {
                const row = document.createElement('div');
                row.className = 'form-field-row';
                if (field.id === 'name') {
                    row.classList.add('name-row');
                }

                // Label input
                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.className = 'field-label-input';
                labelInput.value = field.label;
                if (field.id === 'name') {
                    labelInput.readOnly = true;
                    labelInput.style.border = 'none';
                    labelInput.style.pointerEvents = 'none';
                }
                labelInput.addEventListener('change', (e) => {
                    field.label = e.target.value;
                    renderPreviews();
                });

                // Value input
                const valueInput = document.createElement('input');
                valueInput.type = field.type || 'text';
                valueInput.className = 'field-value-input';
                valueInput.placeholder = `Enter ${field.label}...`;
                valueInput.value = field.value || '';
                valueInput.addEventListener('input', (e) => {
                    field.value = e.target.value;
                    renderPreviews();
                });

                row.appendChild(labelInput);
                row.appendChild(valueInput);

                // Trash button
                if (field.id !== 'name') {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn-delete-field';
                    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                    deleteBtn.addEventListener('click', () => {
                        section.fields.splice(fIndex, 1);
                        renderForm();
                        renderPreviews();
                    });
                    row.appendChild(deleteBtn);
                }

                body.appendChild(row);
            });

            // Add button
            const addFieldBtn = document.createElement('button');
            addFieldBtn.className = 'btn-add-field';
            addFieldBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Field';
            addFieldBtn.addEventListener('click', () => {
                const customId = `custom_${Date.now()}`;
                section.fields.push({
                    id: customId,
                    label: "Custom Field",
                    value: "",
                    isDefault: false
                });
                renderForm();
                renderPreviews();
            });
            body.appendChild(addFieldBtn);

            card.appendChild(body);
            dynamicFormContainer.appendChild(card);
        });
    }

    /* ==========================================================================
       DYNAMIC SHEET PREVIEW RENDERING ENGINE
       ========================================================================== */

    function findField(id) {
        for (let section of biodata.sections) {
            const field = section.fields.find(f => f.id === id);
            if (field) return field;
        }
        return null;
    }

    // Format YYYY-MM-DD -> 15th August 1996
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        const day = date.getDate();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) suffix = 'st';
        else if (day === 2 || day === 22) suffix = 'nd';
        else if (day === 3 || day === 23) suffix = 'rd';
        
        return `${day}${suffix} ${month} ${year}`;
    }

    // Format HH:MM -> 08:45 AM
    function formatTime(timeStr) {
        if (!timeStr) return '';
        const parts = timeStr.split(':');
        if (parts.length < 2) return timeStr;
        
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strHours = hours < 10 ? '0' + hours : hours;
        
        return `${strHours}:${minutes} ${ampm}`;
    }

    function renderSheet(container, themeName) {
        if (!container) return;

        container.innerHTML = '';
        container.className = `theme-${themeName} font-${biodata.fontFamily}`;
        container.style.setProperty('--template-accent', biodata.accentColor);

        // Decorative layers
        container.innerHTML += `
            <div class="background-decor border-tr"></div>
            <div class="background-decor border-bl"></div>
            <div class="background-decor floral-tr"></div>
            <div class="background-decor floral-bl"></div>
            <div class="background-decor decorative-border"></div>
        `;

        const sheetContent = document.createElement('div');
        sheetContent.className = 'sheet-content';

        const nameField = findField('name');
        const candidateName = nameField ? nameField.value.trim() : 'Candidate Name';
        const occupationField = findField('occupation');
        const candidateOccupation = occupationField ? occupationField.value.trim() : '';

        // Header
        let photoHtml = '';
        if (biodata.photo) {
            photoHtml = `
                <div class="photo-frame-container" id="sheet-photo-container">
                    <div class="photo-frame">
                        <img id="biodata-avatar" src="${biodata.photo}" alt="Candidate Photo">
                    </div>
                </div>
            `;
        }

        const headerHtml = `
            <header class="sheet-header">
                <div class="header-text-block">
                    <div class="biodata-subtitle">BIODATA</div>
                    <h1 class="candidate-name">${candidateName}</h1>
                    <p class="candidate-tagline">${candidateOccupation || 'Matrimonial Profile'}</p>
                </div>
                ${photoHtml}
            </header>
        `;
        sheetContent.innerHTML += headerHtml;

        // Divider
        sheetContent.innerHTML += `<div class="sheet-divider"></div>`;

        const sheetBody = document.createElement('div');
        sheetBody.className = 'sheet-body';

        // Add sections
        biodata.sections.forEach(section => {
            const visibleFields = section.fields.filter(field => {
                if (field.id === 'name') return false;
                return field.value && field.value.trim() !== '';
            });

            if (visibleFields.length === 0) return;

            const sectionEl = document.createElement('section');
            sectionEl.className = 'sheet-section';
            sectionEl.setAttribute('data-section', section.id);

            const headingHtml = `
                <h3 class="section-heading">
                    <i class="fa-solid ${section.icon} text-accent"></i>
                    <span>${section.title}</span>
                </h3>
                <div class="section-divider-line"></div>
            `;
            sectionEl.innerHTML += headingHtml;

            const layoutClass = (section.id === 'personal' || section.id === 'contact') ? 'details-grid' : 'details-list';
            const extraContactClass = section.id === 'contact' ? 'contact-grid' : '';
            const listContainer = document.createElement('div');
            listContainer.className = `${layoutClass} ${extraContactClass}`;

            visibleFields.forEach(field => {
                const row = document.createElement('div');
                row.className = 'biodata-row';
                if (field.id === 'address' || field.id === 'siblings' || field.id === 'education' || field.label.toLowerCase().includes('hobbies')) {
                    row.classList.add('full-width');
                }

                let labelText = field.label;
                if (section.id === 'contact') {
                    let contactIcon = 'fa-circle-info';
                    if (field.id === 'phone') contactIcon = 'fa-phone';
                    else if (field.id === 'email') contactIcon = 'fa-envelope';
                    else if (field.id === 'address') contactIcon = 'fa-map-location-dot';
                    labelText = `<i class="fa-solid ${contactIcon} row-icon"></i> ${field.label}`;
                }

                let displayVal = field.value.trim();
                if (field.type === 'date') {
                    displayVal = formatDate(displayVal);
                } else if (field.type === 'time') {
                    displayVal = formatTime(displayVal);
                }

                row.innerHTML = `
                    <span class="field-label">${labelText}</span>
                    <span class="field-value">${displayVal}</span>
                `;
                listContainer.appendChild(row);
            });

            sectionEl.appendChild(listContainer);
            sheetBody.appendChild(sectionEl);
        });

        sheetContent.appendChild(sheetBody);
        container.appendChild(sheetContent);
    }

    function renderPreviews() {
        renderSheet(biodataSheet, biodata.template);
    }

    function renderShowcaseThumbnails() {
        const themes = ['heritage', 'minimal', 'floral', 'navy', 'vintage'];
        themes.forEach(theme => {
            const thumbContainer = document.getElementById(`showcase-sheet-${theme}`);
            if (thumbContainer) {
                renderSheet(thumbContainer, theme);
            }
        });
    }

    /* ==========================================================================
       SHOWCASE SELECT CLICK ROUTING
       ========================================================================== */

    const showcaseCards = document.querySelectorAll('.showcase-card');
    showcaseCards.forEach(card => {
        card.addEventListener('click', () => {
            const selectedTheme = card.getAttribute('data-select-theme');
            
            // Set state
            biodata.template = selectedTheme;
            biodata.accentColor = defaultColors[selectedTheme];
            templateSwapperSelect.value = selectedTheme;

            // Route to final step
            switchStep(4);
            
            applyAccentColor(biodata.accentColor);
        });
    });

    /* ==========================================================================
       SLIDE-UP PREVIEW MODAL EVENT LISTENERS
       ========================================================================== */

    floatingPreviewBtn.addEventListener('click', () => {
        previewModalOverlay.classList.add('open');
        
        // Render into modal preview container
        renderSheet(modalBiodataSheet, biodata.template);
        
        setTimeout(scaleModalPreview, 50);
    });

    closePreviewModalBtn.addEventListener('click', () => {
        previewModalOverlay.classList.remove('open');
    });

    /* ==========================================================================
       SLIDE-UP CUSTOMIZER DRAWER EVENT LISTENERS
       ========================================================================== */

    customizerDrawerTrigger.addEventListener('click', () => {
        customizerBottomSheet.classList.add('open');
    });

    closeBottomSheetBtn.addEventListener('click', () => {
        customizerBottomSheet.classList.remove('open');
    });

    /* ==========================================================================
       CUSTOMIZER VALUE SELECTION TRIGGER ACTIONS
       ========================================================================== */

    function applyAccentColor(hexColor) {
        biodata.accentColor = hexColor;
        biodataSheet.style.setProperty('--template-accent', hexColor);

        colorPresets.forEach(preset => {
            if (preset.getAttribute('data-color') === hexColor) {
                preset.classList.add('active');
            } else {
                preset.classList.remove('active');
            }
        });

        customColorPicker.value = hexColor;
    }

    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            applyAccentColor(preset.getAttribute('data-color'));
        });
    });

    customColorPicker.addEventListener('input', (e) => {
        applyAccentColor(e.target.value);
    });

    fontSelect.addEventListener('change', (e) => {
        biodata.fontFamily = e.target.value;
        renderPreviews();
    });

    templateSwapperSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        biodata.template = selectedTheme;
        applyAccentColor(defaultColors[selectedTheme]);
        renderPreviews();

        let prettyName = selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);
        if (selectedTheme === 'navy') prettyName = 'Royal Navy';
        if (selectedTheme === 'minimal') prettyName = 'Modern Minimal';
        if (selectedTheme === 'floral') prettyName = 'Floral Elegance';
        if (selectedTheme === 'heritage') prettyName = 'Golden Heritage';
        if (selectedTheme === 'vintage') prettyName = 'Vintage Classic';
        activeTemplateLabel.textContent = `Live Preview (${prettyName})`;
    });

    /* ==========================================================================
       IMAGE UPLOADS
       ========================================================================== */

    // Drag-drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    });

    dropZone.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    function handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (PNG, JPG, WebP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            biodata.photo = dataUrl;
            uploadPreviewImg.src = dataUrl;
            
            dropZone.style.display = 'none';
            photoPreviewContainer.style.display = 'flex';
            
            renderPreviews();
        };
        reader.readAsDataURL(file);
    }

    removePhotoBtn.addEventListener('click', () => {
        photoInput.value = '';
        uploadPreviewImg.src = '';
        biodata.photo = null;
        
        dropZone.style.display = 'flex';
        photoPreviewContainer.style.display = 'none';
        
        renderPreviews();
    });

    /* ==========================================================================
       ADAPTIVE PORTABLE SCALING CALCULATOR
       ========================================================================== */

    // Scale Step 4 final sheet view
    function scalePreview() {
        const container = document.getElementById('preview-canvas-container');
        const wrapper = document.getElementById('preview-scale-wrapper');
        if (!container || !wrapper) return;

        const padWidth = 24;
        const padHeight = 24;

        const containerWidth = container.clientWidth - padWidth;
        const containerHeight = container.clientHeight - padHeight;

        if (container.clientWidth <= 0 || container.clientHeight <= 0 || containerWidth <= 0 || containerHeight <= 0) {
            wrapper.style.transform = 'none';
            return;
        }

        const sheetWidth = 794;
        const sheetHeight = 1123;

        const scaleX = containerWidth / sheetWidth;
        const scaleY = containerHeight / sheetHeight;
        
        const scale = Math.max(0.1, Math.min(scaleX, scaleY, 1.0));
        wrapper.style.transform = `scale(${scale})`;
    }

    // Scale modal overlay sheet view
    function scaleModalPreview() {
        const container = document.querySelector('#preview-modal-overlay .modal-body');
        const wrapper = document.getElementById('modal-scale-wrapper');
        if (!container || !wrapper) return;

        const padWidth = 24;
        const padHeight = 24;

        const containerWidth = container.clientWidth - padWidth;
        const containerHeight = container.clientHeight - padHeight;

        if (container.clientWidth <= 0 || container.clientHeight <= 0 || containerWidth <= 0 || containerHeight <= 0) {
            wrapper.style.transform = 'none';
            return;
        }

        const sheetWidth = 794;
        const sheetHeight = 1123;

        const scaleX = containerWidth / sheetWidth;
        const scaleY = containerHeight / sheetHeight;
        
        const scale = Math.max(0.1, Math.min(scaleX, scaleY, 1.0));
        wrapper.style.transform = `scale(${scale})`;
    }

    // Hook up listeners
    window.addEventListener('resize', () => {
        scalePreview();
        scaleModalPreview();
    });

    /* ==========================================================================
       SAMPLE DATA GENERATOR
       ========================================================================== */

    loadSampleBtn.addEventListener('click', () => {
        biodata.sections = JSON.parse(JSON.stringify(sampleSections));
        biodata.photo = "assets/default_avatar.png";
        
        uploadPreviewImg.src = "assets/default_avatar.png";
        dropZone.style.display = 'none';
        photoPreviewContainer.style.display = 'flex';

        // Draw views
        renderForm();
        renderPreviews();
        
        // If modal open, redraw modal A4 sheet too
        if (previewModalOverlay.classList.contains('open')) {
            renderSheet(modalBiodataSheet, biodata.template);
        }

        // Success flash
        loadSampleBtn.classList.add('success-flash');
        setTimeout(() => loadSampleBtn.classList.remove('success-flash'), 1000);
    });

    /* ==========================================================================
       PDF & PRINT EXPORTS
       ========================================================================== */

    function downloadPDF() {
        const nameField = findField('name');
        const candidateName = nameField ? nameField.value.trim() : 'Profile';
        const formattedFileName = `${candidateName.replace(/\s+/g, '_')}_Biodata.pdf`;
        
        const opt = {
            margin: 0,
            filename: formattedFileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 3, 
                useCORS: true, 
                letterRendering: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        const originalText = nextStepBtn.innerHTML;
        nextStepBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ...';
        nextStepBtn.disabled = true;

        html2pdf().set(opt).from(biodataSheet).save().then(() => {
            nextStepBtn.innerHTML = originalText;
            nextStepBtn.disabled = false;
        }).catch((err) => {
            console.error("PDF generation failed: ", err);
            alert("PDF export failed. You can use the Print button instead.");
            nextStepBtn.innerHTML = originalText;
            nextStepBtn.disabled = false;
        });
    }

    function printBiodata() {
        window.print();
    }

    printBtn.addEventListener('click', printBiodata);

    /* ==========================================================================
       RUNTIME STARTUP
       ========================================================================== */
    
    // Initial draw
    renderForm();
    renderPreviews();

    // Scale
    setTimeout(() => {
        scalePreview();
        scaleModalPreview();
    }, 150);

    // Boot step 1
    switchStep(1);
});
