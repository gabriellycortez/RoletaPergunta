const questions = [
            {
                id: 1,
                question: "Se uma pessoa leva 10 minutos para caminhar 1 km, quanto tempo levará para caminhar 5 km?",
                options: ["30 minutos", "50 minutos", "60 minutos", "45 minutos"],
                correct: 1 // índice da opção correta (50 minutos)
            },
            {
                id: 2,
                question: "Qual é o próximo número na sequência: 2, 4, 8, 16, ...?",
                options: ["24", "32", "30", "20"],
                correct: 1 // 32
            },
            {
                id: 3,
                question: "Se hoje é segunda-feira, que dia será daqui a 100 dias?",
                options: ["Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"],
                correct: 1 // Quarta-feira
            },
            {
                id: 4,
                question: "Qual destes NÃO é um sistema operacional?",
                options: ["Windows", "Linux", "Python", "macOS"],
                correct: 2 // Python
            },
            {
                id: 5,
                question: "Quantos bits tem um byte?",
                options: ["4", "8", "16", "32"],
                correct: 1 // 8
            },
            {
                id: 6,
                question: "Qual é a capital do Brasil?",
                options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
                correct: 2 // Brasília
            },
            {
                id: 7,
                question: "Qual é o animal que representa a logomarca do Firefox?",
                options: ["Raposa", "Panda", "Urso", "Tigre"],
                correct: 0 // Raposa
            },
            {
                id: 8,
                question: "Quantos lados tem um hexágono?",
                options: ["5", "6", "7", "8"],
                correct: 1 // 6
            },
            {
                id: 9,
                question: "Qual é a linguagem de programação conhecida como a 'linguagem da web'?",
                options: ["Python", "Java", "JavaScript", "C++"],
                correct: 2 // JavaScript
            },
            {
                id: 10,
                question: "Qual destes é um número primo?",
                options: ["9", "15", "17", "21"],
                correct: 2 // 17
            },
            {
                id: 11,
                question: "O que significa a sigla HTML?",
                options: [
                    "HyperText Markup Language",
                    "High Tech Modern Language",
                    "Home Tool Markup Language",
                    "Hyperlink Text Management Language"
                ],
                correct: 0 // HyperText Markup Language
            },
            {
                id: 12,
                question: "Se 3 pessoas levam 3 horas para pintar 3 paredes, quanto tempo 6 pessoas levariam para pintar 6 paredes?",
                options: ["3 horas", "4 horas", "5 horas", "6 horas"],
                correct: 0 // 3 horas
            },
            {
                id: 13,
                question: "Qual destes dispositivos é um periférico de entrada?",
                options: ["Monitor", "Impressora", "Teclado", "Caixa de som"],
                correct: 2 // Teclado
            },
            {
                id: 14,
                question: "Qual é o resultado de 7 x 8 + 4?",
                options: ["60", "64", "68", "72"],
                correct: 0 // 60
            },
            {
                id: 15,
                question: "Qual empresa criou o iPhone?",
                options: ["Microsoft", "Samsung", "Apple", "Google"],
                correct: 2 // Apple
            }
        ];

        // Elementos DOM
        const rouletteWheel = document.getElementById('roulette-wheel');
        const spinBtn = document.getElementById('spin-btn');
        const resetBtn = document.getElementById('reset-btn');
        const questionModal = document.getElementById('question-modal');
        const closeModal = document.getElementById('close-modal');
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const feedback = document.getElementById('feedback');
        const nextBtn = document.getElementById('next-btn');
        const resultContainer = document.getElementById('result-container');
        const correctCountElem = document.getElementById('correct-count');
        const totalCountElem = document.getElementById('total-count');
        const timerElem = document.getElementById('timer');

        // Variáveis de estado
        let isSpinning = false;
        let currentQuestion = null;
        let correctAnswers = 0;
        let totalQuestions = 0;
        let timer;
        let timeLeft = 30;

        // Inicializar a roleta com números
        function initializeRoulette() {
            const numbersCount = 15;
            const angleStep = 360 / numbersCount;
            
            for (let i = 0; i < numbersCount; i++) {
                const number = document.createElement('div');
                number.className = 'number';
                number.textContent = i + 1;
                
                // Posicionar os números em um círculo
                const angle = i * angleStep;
                number.style.transform = `rotate(${angle}deg) translate(0, -160px) rotate(-${angle}deg)`;
                
                rouletteWheel.appendChild(number);
            }
        }

        // Girar a roleta
        function spinRoulette() {
            if (isSpinning) return;
            
            isSpinning = true;
            spinBtn.disabled = true;
            
            // Gerar um número aleatório entre 0 e 14 (15 números)
            const randomNumber = Math.floor(Math.random() * 15);
            
            // Calcular o ângulo de rotação (cada número tem 24 graus)
            const rotationAngle = 3600 + (randomNumber * 24); // 3600 para várias rotações completas
            
            // Aplicar a rotação
            rouletteWheel.style.transform = `rotate(${rotationAngle}deg)`;
            
            // Aguardar a rotação terminar e mostrar a pergunta
            setTimeout(() => {
                isSpinning = false;
                spinBtn.disabled = false;
                
                // Encontrar a pergunta correspondente ao número
                currentQuestion = questions[randomNumber];
                showQuestion(currentQuestion);
            }, 2500); // Reduzido de 4000 para 2500 ms
        }

        // Mostrar pergunta no modal
        function showQuestion(question) {
            questionText.textContent = question.question;
            optionsContainer.innerHTML = '';
            
            // Adicionar opções de resposta
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.textContent = option;
                optionElement.dataset.index = index;
                
                optionElement.addEventListener('click', () => selectOption(optionElement, question));
                optionsContainer.appendChild(optionElement);
            });
            
            // Resetar elementos de feedback
            feedback.className = 'feedback';
            feedback.textContent = '';
            nextBtn.style.display = 'none';
            
            // Iniciar o cronômetro
            startTimer(question);
            
            // Mostrar o modal
            questionModal.style.display = 'flex';
            
            // Atualizar contador de perguntas
            totalQuestions++;
            totalCountElem.textContent = totalQuestions;
            resultContainer.style.display = 'block';
        }

        // Iniciar o cronômetro
        function startTimer(question) {
            timeLeft = 30;
            timerElem.textContent = `${timeLeft}s`;
            timerElem.classList.remove('warning');
            
            timer = setInterval(() => {
                timeLeft--;
                timerElem.textContent = `${timeLeft}s`;
                
                // Aviso visual quando o tempo estiver acabando
                if (timeLeft <= 10) {
                    timerElem.classList.add('warning');
                }
                
                // Tempo esgotado
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    timeUp(question);
                }
            }, 1000);
        }

        // Tempo esgotado
        function timeUp(question) {
            // Desabilitar todas as opções
            const allOptions = optionsContainer.querySelectorAll('.option');
            allOptions.forEach(option => {
                option.classList.add('disabled');
                option.style.pointerEvents = 'none';
            });
            
            // Mostrar a resposta correta
            allOptions[question.correct].classList.add('correct');
            
            // Mostrar feedback
            feedback.textContent = 'Tempo esgotado! A resposta correta está destacada.';
            feedback.className = 'feedback timeout';
            
            // Mostrar botão para próxima pergunta
            nextBtn.style.display = 'block';
        }

        // Selecionar uma opção
        function selectOption(selectedOption, question) {
            // Parar o cronômetro
            clearInterval(timer);
            
            // Desabilitar todas as opções
            const allOptions = optionsContainer.querySelectorAll('.option');
            allOptions.forEach(option => {
                option.style.pointerEvents = 'none';
            });
            
            const selectedIndex = parseInt(selectedOption.dataset.index);
            
            // Verificar se a resposta está correta
            if (selectedIndex === question.correct) {
                selectedOption.classList.add('correct');
                feedback.textContent = 'Resposta correta! Parabéns!';
                feedback.className = 'feedback correct';
                correctAnswers++;
                correctCountElem.textContent = correctAnswers;
            } else {
                selectedOption.classList.add('incorrect');
                feedback.textContent = 'Resposta incorreta. A resposta correta está destacada.';
                feedback.className = 'feedback incorrect';
                
                // Mostrar a resposta correta
                allOptions[question.correct].classList.add('correct');
            }
            
            // Mostrar botão para próxima pergunta
            nextBtn.style.display = 'block';
        }

        // Fechar modal e preparar para próxima pergunta
        function closeQuestionModal() {
            // Parar o cronômetro se ainda estiver rodando
            clearInterval(timer);
            questionModal.style.display = 'none';
        }

        // Reiniciar o jogo
        function resetGame() {
            // Parar o cronômetro se estiver rodando
            clearInterval(timer);
            
            // Zerar contadores
            correctAnswers = 0;
            totalQuestions = 0;
            
            // Atualizar exibição
            correctCountElem.textContent = '0';
            totalCountElem.textContent = '0';
            
            // Esconder resultado
            resultContainer.style.display = 'none';
            
            // Resetar a roleta
            rouletteWheel.style.transform = 'rotate(0deg)';
            
            // Fechar modal se estiver aberto
            questionModal.style.display = 'none';
            
            // Habilitar botão de girar se estiver desabilitado
            spinBtn.disabled = false;
        }

        // Event listeners
        spinBtn.addEventListener('click', spinRoulette);
        resetBtn.addEventListener('click', resetGame);
        closeModal.addEventListener('click', closeQuestionModal);
        nextBtn.addEventListener('click', closeQuestionModal);

        // Inicializar a roleta quando a página carregar
        window.addEventListener('load', initializeRoulette);