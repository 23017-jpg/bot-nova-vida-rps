const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionFlagsBits,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    AuditLogEvent,
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildModeration 
    ]
});

// ================== CONFIGURAÇÃO DO SERVIDOR ==================
const CONFIG = {
    TOKEN: 'MTUyMDE2MTE2MTIyMjI5MTYyOA.GbKpGs.eY-6r59wajG5exOyJLDVFg2mOOp8lLXAyG2Q1E', 
    CLIENT_ID: '1520161161222291628', // Garante que colocas o ID do Bot aqui!
    CARGO_STAFF_ID: '1500516012921982999',
    CANAL_LOGS_ID: '1500516017598890056', 
    
    CANAL_ENTRADAS_ID: '1500516013433946158',
    
    // Canais de Logs
    CANAL_LOGS_GERAIS_ID: '1500516017598890055',       
    CANAL_LOGS_MENSAGENS_ID: '1500516017598890058',    
    CANAL_LOGS_VOZ_ID: '1500516017598890059',          
    CANAL_LOGS_VERIFICACOES_ID: '1500516017359683762', // Canal para logs de verificação

    CANAL_VERIFICACAO_ID: '1500516013433946155',
    CARGO_CIDADAO_ID: '1500516012855136281',

    CATEGORIA_GERAL: '1520165074692735169',
    CATEGORIA_BUGS: '1520165307786723429',
    CATEGORIA_CANDIDATURAS: '1520165253151723550',
    CATEGORIA_DENUNCIAS: '1520165534249914609', 
    CATEGORIA_ORGS: '1520165534249914609',      
    CATEGORIA_VIPS: '1520165778484363364',
    CATEGORIA_BANS: '1520165884193144892'
};
// ==============================================================

// REGISTO DOS SLASH COMMANDS E PRESENÇA DO BOT
client.once('ready', async () => {
    console.log(`🚀 [Nova Vida RP] Bot online: ${client.user.tag}`);

    // Define o texto que aparece no perfil do bot
    client.user.setActivity('Bot feito pelo Morais para Nova Vida RP!', { type: 0 });

    const commands = [
        new SlashCommandBuilder()
            .setName('setup')
            .setDescription('Envia o painel de tickets para o suporte.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('verify')
            .setDescription('Envia o painel oficial de verificação de cidadãos.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('limpar')
            .setDescription('Limpa uma quantidade de mensagens do chat atual.')
            .addIntegerOption(option => 
                option.setName('quantidade')
                    .setDescription('Número de mensagens a apagar (1 a 100)')
                    .setRequired(true)
                    .setMinValue(1)
                    .setMaxValue(100)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(CONFIG.TOKEN);

    try {
        console.log('🔄 A carregar todos os comandos de barra (/) no Discord...');
        await rest.put(
            Routes.applicationCommands(CONFIG.CLIENT_ID),
            { body: commands },
        );
        console.log('✅ Comandos registados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao registar comandos de barra:', error);
    }
});

// ================= EXECUÇÃO DOS COMANDOS DE BARRA (/) =================

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'setup') {
        await interaction.deferReply({ ephemeral: true });

        const embedPainel = new EmbedBuilder()
            .setTitle('🎟️ Sistema de Tickets — Nova Vida RP')
            .setDescription('Bem-vindo ao sistema de tickets. Escolhe a categoria que melhor corresponde ao teu assunto. A nossa equipa responderá o mais rapidamente possível...')
            .setColor('#2F3136')
            .setThumbnail(interaction.guild.iconURL());

        const menuSelecao = new StringSelectMenuBuilder()
            .setCustomId('menu_tickets')
            .setPlaceholder('Escolha uma categoria...')
            .addOptions([
                { label: 'VIPs', value: 'ticket_vips', emoji: '💵' },
                { label: 'Bugs', value: 'ticket_bugs', emoji: '🐯' },
                { label: 'Suporte Geral', value: 'ticket_geral', emoji: '🎫' },
                { label: 'Eventos', value: 'ticket_eventos', emoji: '🎭' },
                { label: 'Streamers', value: 'ticket_streamers', emoji: '🎥' },
                { label: 'Candidaturas', value: 'ticket_candidaturas', emoji: '📝' },
                { label: 'Organizações', value: 'ticket_orgs', emoji: '💼' },
                { label: 'Denúncias', value: 'ticket_denuncias', emoji: '🚨' },
                { label: 'Bans', value: 'ticket_bans', emoji: '🚫' },
            ]);

        const row = new ActionRowBuilder().addComponents(menuSelecao);
        await interaction.channel.send({ embeds: [embedPainel], components: [row] });
        await interaction.editReply({ content: '✅ Painel de tickets enviado com sucesso!' });
    }

    if (interaction.commandName === 'verify') {
        await interaction.deferReply({ ephemeral: true });

        const embedVerificacao = new EmbedBuilder()
            .setTitle('🛡️ VERIFICAÇÃO | Nova Vida RP')
            .setDescription('**Bem-vindo ao Nova Vida RP!**\n\n➔ Para desbloqueares o acesso completo ao Discord, clica no botão abaixo e conclui a tua verificação.')
            .setColor('#2F3136')
            .setThumbnail(interaction.guild.iconURL());

        const botaoVerificar = new ButtonBuilder()
            .setCustomId('botao_verificar')
            .setLabel('Concluir Verificação')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success);

        const rowVerify = new ActionRowBuilder().addComponents(botaoVerificar);
        await interaction.channel.send({ embeds: [embedVerificacao], components: [rowVerify] });
        await interaction.editReply({ content: '✅ Painel de verificação enviado!' });
    }

    if (interaction.commandName === 'limpar') {
        const quantidade = interaction.options.getInteger('quantidade');
        await interaction.deferReply({ ephemeral: true });

        try {
            const mensagensApagadas = await interaction.channel.bulkDelete(quantidade, true);
            await interaction.editReply({ content: `🧹 Sucesso! Foram limpas **${mensagensApagadas.size}** mensagens deste canal.` });

            const canalLogsGerais = interaction.guild.channels.cache.get(CONFIG.CANAL_LOGS_GERAIS_ID);
            if (canalLogsGerais) {
                const embedLimpar = new EmbedBuilder()
                    .setTitle('🧹 [LOG GERAL] Chat Limpo')
                    .setColor('#f39c12')
                    .setDescription(
                        `> **Staffer:** ${interaction.user}\n` +
                        `> **Canal:** ${interaction.channel}\n` +
                        `> **Mensagens apagadas:** \`${mensagensApagadas.size}\``
                    ).setTimestamp();
                canalLogsGerais.send({ embeds: [embedLimpar] }).catch(() => {});
            }
        } catch (error) {
            await interaction.editReply({ content: '❌ Erro ao tentar apagar as mensagens neste canal.' });
        }
    }
});

// ================= AUTOMATIZAÇÃO DE LOGS DE TEXTO E VOZ =================

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const canalLogsMensagens = message.guild.channels.cache.get(CONFIG.CANAL_LOGS_MENSAGENS_ID);
    if (canalLogsMensagens && message.channel.id !== CONFIG.CANAL_LOGS_MENSAGENS_ID) {
        const embedLogMsg = new EmbedBuilder()
            .setTitle('💬 [LOG] Mensagem Enviada')
            .setColor('#3498db')
            .addFields(
                { name: '👤 Autor', value: `> ${message.author}`, inline: true },
                { name: '💬 Canal', value: `> ${message.channel}`, inline: true },
                { name: '📄 Conteúdo', value: `\`\`\`${message.content.slice(0, 1000) || '[Ficheiro/Imagem]'}\`\`\``, inline: false }
            ).setTimestamp();
        canalLogsMensagens.send({ embeds: [embedLogMsg] }).catch(() => {});
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const canalLogsVoz = newState.guild.channels.cache.get(CONFIG.CANAL_LOGS_VOZ_ID);
    if (!canalLogsVoz) return;
    const usuario = newState.member.user;

    if (!oldState.channelId && newState.channelId) {
        const embedEntrouCall = new EmbedBuilder().setTitle('🔊 [LOG VOZ] Entrou em Call').setColor('#2ecc71').setDescription(`> **Utilizador:** ${usuario}\n> **Canal:** ${newState.channel}`).setTimestamp();
        canalLogsVoz.send({ embeds: [embedEntrouCall] }).catch(() => {});
    }
    if (oldState.channelId && !newState.channelId) {
        const embedSaiuCall = new EmbedBuilder().setTitle('🔇 [LOG VOZ] Saiu de Call').setColor('#e74c3c').setDescription(`> **Utilizador:** ${usuario}\n> **Canal:** \`#${oldState.channel.name}\``).setTimestamp();
        canalLogsVoz.send({ embeds: [embedSaiuCall] }).catch(() => {});
    }
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        const embedMudouCall = new EmbedBuilder().setTitle('🔀 [LOG VOZ] Mudou de Call').setColor('#f1c40f').setDescription(`> **Utilizador:** ${usuario}\n> **De:** \`#${oldState.channel.name}\`\n> **Para:** ${newState.channel}`).setTimestamp();
        canalLogsVoz.send({ embeds: [embedMudouCall] }).catch(() => {});
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const canalLogsGerais = newMember.guild.channels.cache.get(CONFIG.CANAL_LOGS_GERAIS_ID);
    if (!canalLogsGerais) return;

    if (oldMember.nickname !== newMember.nickname) {
        const embedNick = new EmbedBuilder().setTitle('✏️ [LOG GERAL] Nickname Alterado').setColor('#9b59b6').setDescription(`> **Utilizador:** ${newMember.user}\n> **De:** \`${oldMember.nickname || oldMember.user.username}\`\n> **Para:** \`${newMember.nickname || newMember.user.username}\``).setTimestamp();
        canalLogsGerais.send({ embeds: [embedNick] }).catch(() => {});
    }
    if (!oldMember.communicationDisabledUntilTimestamp && newMember.communicationDisabledUntilTimestamp) {
        const embedTimeout = new EmbedBuilder().setTitle('🤫 [LOG GERAL] Jogador Muted (Timeout)').setColor('#e67e22').setDescription(`> **Jogador:** ${newMember.user}\n> **Até:** <t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:F>`).setTimestamp();
        canalLogsGerais.send({ embeds: [embedTimeout] }).catch(() => {});
    }
});

client.on('guildBanAdd', async (ban) => {
    const canalLogsGerais = ban.guild.channels.cache.get(CONFIG.CANAL_LOGS_GERAIS_ID);
    if (!canalLogsGerais) return;
    const embedBan = new EmbedBuilder().setTitle('🚫 [LOG GERAL] Jogador Banido').setColor('#990000').setDescription(`> **Jogador Banido:** ${ban.user}\n> **Razão:** ${ban.reason || 'Nenhuma razão fornecida.'}`).setTimestamp();
    canalLogsGerais.send({ embeds: [embedBan] }).catch(() => {});
});

client.on('guildMemberRemove', async (member) => {
    const canalLogsGerais = member.guild.channels.cache.get(CONFIG.CANAL_LOGS_GERAIS_ID);
    if (!canalLogsGerais) return;
    const embedLogSaida = new EmbedBuilder().setTitle('📤 [LOG GERAL] Jogador Saiu do Servidor').setColor('#F04747').setDescription(`> **Jogador:** ${member.user}`).setTimestamp();
    await canalLogsGerais.send({ embeds: [embedLogSaida] }).catch(() => {});

    try {
        const fetchedLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberKick });
        const kickLog = fetchedLogs.entries.first();
        if (kickLog && kickLog.target.id === member.id && (Date.now() - kickLog.createdTimestamp < 5000)) {
            const embedKick = new EmbedBuilder().setTitle('🥾 [LOG GERAL] Jogador Expulso (Kicked)').setColor('#e74c3c').setDescription(`> **Jogador:** ${member.user}\n> **Staffer:** ${kickLog.executor}\n> **Razão:** ${kickLog.reason || 'Nenhuma.'}`).setTimestamp();
            canalLogsGerais.send({ embeds: [embedKick] }).catch(() => {});
        }
    } catch (e) {}
});

client.on('guildMemberAdd', async (member) => {
    const canalEntradas = member.guild.channels.cache.get(CONFIG.CANAL_ENTRADAS_ID);
    if (canalEntradas) {
        const embedBoasVindas = new EmbedBuilder().setTitle('👋 Bem-vindo ao Nova Vida RP!').setDescription(`Olá ${member}, seja bem-vindo à nossa cidade!`).setColor('#2F3136').setTimestamp();
        canalEntradas.send({ content: `✨ Bem-vindo ${member}!`, embeds: [embedBoasVindas] }).catch(() => {});
    }
    const canalLogsGerais = member.guild.channels.cache.get(CONFIG.CANAL_LOGS_GERAIS_ID);
    if (canalLogsGerais) {
        const embedLogEntrada = new EmbedBuilder().setTitle('📥 [LOG GERAL] Jogador Entrou').setColor('#43B581').setDescription(`> **Jogador:** ${member.user}`).setTimestamp();
        canalLogsGerais.send({ embeds: [embedLogEntrada] }).catch(() => {});
    }
});

// ================= INTERAÇÕES (BOTÕES / SELEÇÃO TICKETS / VERIFICAÇÃO) =================

client.on('interactionCreate', async (interaction) => {
    // Clique do botão de verificação
    if (interaction.isButton() && interaction.customId === 'botao_verificar') {
        const cargoCidadao = interaction.guild.roles.cache.get(CONFIG.CARGO_CIDADAO_ID);
        if (!cargoCidadao) return interaction.reply({ content: '❌ Erro: Cargo de cidadão não encontrado.', ephemeral: true });
        
        if (interaction.member.roles.cache.has(CONFIG.CARGO_CIDADAO_ID)) {
            return interaction.reply({ content: 'ℹ️ Já estás verificado no servidor!', ephemeral: true });
        }

        try {
            await interaction.member.roles.add(cargoCidadao);
            await interaction.reply({ content: '✅ **Verificação Concluída!** O teu acesso foi libertado.', ephemeral: true });
            
            // Envia a Log para o canal exclusivo de VERIFICAÇÕES
            const canalLogsVerif = interaction.guild.channels.cache.get(CONFIG.CANAL_LOGS_VERIFICACOES_ID);
            if (canalLogsVerif) {
                const embedLogVerif = new EmbedBuilder()
                    .setTitle('🛡️ [LOG VERIFICAÇÃO] Novo Cidadão')
                    .setColor('#2ecc71')
                    .setDescription(`> **Utilizador:** ${interaction.user} (\`${interaction.user.tag}\`)\n> **ID:** \`${interaction.user.id}\`\n> **Ação:** Passou com sucesso na verificação.`)
                    .setTimestamp();
                canalLogsVerif.send({ embeds: [embedLogVerif] }).catch(() => {});
            }
        } catch (e) { 
            return interaction.reply({ content: '❌ Erro ao atribuir o cargo.', ephemeral: true }); 
        }
    }

    // Criação de canais de tickets
    if (interaction.isStringSelectMenu() && interaction.customId === 'menu_tickets') {
        await interaction.deferReply({ ephemeral: true });
        const valorSelecionado = interaction.values[0];
        const emojiCategoria = interaction.component.options.find(o => o.value === valorSelecionado).emoji.name;
        let categoriaID = CONFIG.CATEGORIA_GERAL; 
        if (valorSelecionado === 'ticket_vips') categoriaID = CONFIG.CATEGORIA_VIPS;
        if (valorSelecionado === 'ticket_bugs') categoriaID = CONFIG.CATEGORIA_BUGS;
        if (valorSelecionado === 'ticket_candidaturas') categoriaID = CONFIG.CATEGORIA_CANDIDATURAS;
        if (valorSelecionado === 'ticket_denuncias') categoriaID = CONFIG.CATEGORIA_DENUNCIAS;
        if (valorSelecionado === 'ticket_orgs') categoriaID = CONFIG.CATEGORIA_ORGS;
        if (valorSelecionado === 'ticket_bans') categoriaID = CONFIG.CATEGORIA_BANS;

        const nomeCanal = `${emojiCategoria}│${valorSelecionado.replace('ticket_', '')}-${interaction.user.username}`;
        const canalExistente = interaction.guild.channels.cache.find(c => c.name.includes(interaction.user.username) && c.name.includes(valorSelecionado.replace('ticket_', '')));
        if (canalExistente) return interaction.editReply({ content: `❌ Já tens um ticket aberto: ${canalExistente}` });

        const canalTicket = await interaction.guild.channels.create({
            name: nomeCanal,
            type: ChannelType.GuildText,
            parent: categoriaID,
            permissionOverwrites: [
                { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                { id: CONFIG.CARGO_STAFF_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
            ],
        });

        const embedTicket = new EmbedBuilder().setTitle(`📥 Suporte Iniciado — Nova Vida RP`).setDescription(`Olá ${interaction.user}, bem-vindo ao teu atendimento privado.`).setColor('#2F3136').setTimestamp();
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('fechar_ticket').setLabel('Fechar').setEmoji('🔒').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('ping_staff').setLabel('Ping Staff').setEmoji('🔔').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('renomear_ticket').setLabel('Renomear').setEmoji('✏️').setStyle(ButtonStyle.Secondary)
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('add_player').setLabel('Add Player').setEmoji('👤').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('remove_player').setLabel('Remover Player').setEmoji('❌').setStyle(ButtonStyle.Danger)
        );
        await canalTicket.send({ content: `👋 ${interaction.user} | <@&${CONFIG.CARGO_STAFF_ID}>`, embeds: [embedTicket], components: [row1, row2] });

        const canalLogs = interaction.guild.channels.cache.get(CONFIG.CANAL_LOGS_ID);
        if (canalLogs) {
            const embedLogOpen = new EmbedBuilder().setTitle('📥 [LOG] Ticket Criado').setColor('#43B581').addFields({ name: '👤 Utilizador', value: `> ${interaction.user}` }, { name: '💬 Canal', value: `> ${canalTicket}` }).setTimestamp();
            canalLogs.send({ embeds: [embedLogOpen] }).catch(() => {});
        }
        await interaction.editReply({ content: `✅ Ticket criado: ${canalTicket}` });
    }

    // Modais internos dos Tickets
    if (interaction.isButton()) {
        if (interaction.customId === 'fechar_ticket') {
            await interaction.deferReply();
            const canalLogs = interaction.guild.channels.cache.get(CONFIG.CANAL_LOGS_ID);
            if (canalLogs) {
                const embedLogClose = new EmbedBuilder().setTitle('🔒 [LOG] Ticket Fechado').setColor('#F04747').addFields({ name: '💬 Canal', value: `> \`#${interaction.channel.name}\`` }, { name: '🎬 Por', value: `> ${interaction.user}` }).setTimestamp();
                await canalLogs.send({ embeds: [embedLogClose] }).catch(() => {});
            }
            await interaction.editReply({ content: '🔒 Canal a apagar em 5 segundos...' });
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }
        if (interaction.customId === 'ping_staff') await interaction.reply({ content: `🔔 <@&${CONFIG.CARGO_STAFF_ID}>, atendimento urgente!`, allowedMentions: { roles: [CONFIG.CARGO_STAFF_ID] } });
        if (interaction.customId === 'add_player') {
            const modal = new ModalBuilder().setCustomId('modal_add').setTitle('Adicionar Jogador');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('user_id').setLabel('ID do Discord').setStyle(TextInputStyle.Short).setRequired(true)));
            await interaction.showModal(modal);
        }
        if (interaction.customId === 'remove_player') {
            const modal = new ModalBuilder().setCustomId('modal_remove').setTitle('Remover Jogador');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('user_id').setLabel('ID do Discord').setStyle(TextInputStyle.Short).setRequired(true)));
            await interaction.showModal(modal);
        }
        if (interaction.customId === 'renomear_ticket') {
            const modal = new ModalBuilder().setCustomId('modal_rename').setTitle('Renomear Ticket');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('novo_nome').setLabel('Novo Nome').setStyle(TextInputStyle.Short).setRequired(true)));
            await interaction.showModal(modal);
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_add') {
            const id = interaction.fields.getTextInputValue('user_id');
            await interaction.channel.permissionOverwrites.edit(id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });
            await interaction.reply({ content: `👤 <@${id}> adicionado.` });
        }
        if (interaction.customId === 'modal_remove') {
            const id = interaction.fields.getTextInputValue('user_id');
            await interaction.channel.permissionOverwrites.delete(id);
            await interaction.reply({ content: `❌ <@${id}> removido.` });
        }
        if (interaction.customId === 'modal_rename') {
            const novoNome = interaction.fields.getTextInputValue('novo_nome');
            await interaction.channel.setName(novoNome);
            await interaction.reply({ content: `✏️ Canal alterado para \`${novoNome}\`.` });
        }
    }
});

// Servidor Web para o Render e UptimeRobot não deixarem o bot dormir
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot Nova Vida RP Online!'));
app.listen(process.env.PORT || 3000, () => console.log('🌐 Servidor web do bot iniciado!'));

client.login(process.env.DISCORD_TOKEN);

