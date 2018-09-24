// Tree branch contents
var locations = [
    'Austin',
    'Boston',
    'Chicago',
    'Dallas/Ft Worth',
    'Denver',
    'France',
    'London',
    'Los Angeles',
    'New York',
    'San Diego',
    'Seattle',
    'SF Bay Area',
    'Toronto',
    'Washington D.C.',
];
var skills = [
    'Agile',
    'Android',
    'AngularJS',
    'Bootstrap',
    'C++',
    'C',
    'C#',
    'Clojure',
    'CSS',
    '.NET',
    'Elixir',
    'Ember.js',
    'Erlang',
    'F#',
    'Go',
    'Haskell',
    'HTML',
    'iOS',
    'Java',
    'JavaScript',
    'jQuery',
    'Kotlin',
    'Node.js',
    'Perl',
    'Photoshop',
    'PHP',
    'Python',
    'R Programming',
    'React',
    'Ruby',
    'Ruby on Rails',
    'Rust',
    'Scala',
    'SQL',
    'Swift',
    'Unity',
    'Vue.js'
]
var seSubs = [
    'Frontend Engineer',
    'Security Engineer',
    'Hardware Engineer',
    'Embedded Engineer',
    'Full Stack Engineer',
    'Backend Engineer',
    'Mobile Engineer',
    'Data Engineer',
    'Machine Learning Engineer',
    'Gaming Engineer',
    'Computer Vision Engineer',
    'Search Engineer',
    'NLP Engineer',
    'AR/VR Engineer',
    'Blockchain Engineer',
];
var emSubs = [
    'Applications Engineering Manager',
    'Data Infrastructure Engineer',
    'DevOps Manager',
    'Machine Learning Engineer',
    'Mobile Engineering Manager',
    'QA Manager',
    'Search Engineering Manager',
]
var designSubs = [
    'UX Designer',
    'Visual/UI Designer',
    'UX Researcher',
    'Brand/Graphic Designer',
    'Product Designer'
]  
var anycsSubs = [
    'Data Scientist',
    'Data Analyst',
    'Business Analyst',
    'Business Operations'
]
var devOpsSubs = [
    'Build/Release Engineer',
    'DevOps Engineer',
    'Site Reliability Engineer (SRE)',
]
var qaSubs = [
    'QA Test Automation Engineer',
    'QA Manual Test Engineer'
]
var itSubs = [
    'Database Administrator',
    'Network Engineer',
    'Network Administrator',
    'Systems Administrator',
    'Desktop Support',
    'Solutions Engineer',
    'Solutions Architect',
    'Salesforce Developer',
    'Business Systems Engineer',
    'NOC Engineer'
]
var prjSubs = [
    'Project Manager',
    'Program Manager',
    'IT Project Manager',
    'Technical Program Manager'
]
var pmSubs = [
    'Product Manager'
]
var primaryRoles = [
    { name:'Software Engineering',    className:'se'        },
    { name:'Engineering Management',  className:'em'        },
    { name:'Design',                  className:'design'    },
    { name:'Data Analytics',          className:'anycs' },
    { name:'Developer Operations',    className:'devOps'    },
    { name:'Quality Assurance (QA)',  className:'qa'        },
    { name:'Information Technology',  className:'it'        },
    { name:'Project Management',      className:'prj'       },
    { name:'Product Management',      className:'pm'        }
];

// main branches
$(".locations ul").html(locations.map(function(value) { return('<li><div><span href="#">' + value + '</span></div><ul></ul></li>'); }).join(""));
$(".locations ul li ul").html(primaryRoles.map(function(value) { return('<li class="'+ value.className + '"><div><span href="#">' + value.name + '</span></div><ul></ul></li>'); }).join(""));
$(".roles:not(.paths) ul").html(primaryRoles.map(function(value) { return('<li class="'+ value.className + '"><div><span href="#">' + value.name + '</span></div><ul></ul></li>'); }).join(""));
$(".roles.paths ul").html(primaryRoles.map(function(value) { return('<li class="'+ value.className + '"><div>' + value.name + '</div><ul></ul></li>'); }).join(""));
$(".skills ul").html(skills.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));

// set subroles
$(".se ul").html(seSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));
$(".em ul").html(emSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));
$(".design ul").html(designSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));
$(".anycs ul").html(anycsSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));
$(".devOps ul").html(devOpsSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));
$(".qa ul").html(qaSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));
$(".it ul").html(itSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));
$(".prj ul").html(prjSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));
$(".pm ul").html(pmSubs.map(function(value) { return('<li class="link"><a href="#">' + value + '</a></li>'); }).join(""));

// prefix phrases
$(".jobs.locations ul span, .jobs.locations ul a").prepend("Jobs in ");
$(".jobs.roles ul span, .jobs.roles ul a").append(" Jobs");
$(".jobs.skills ul a").prepend("Jobs requiring ");
$(".companies.locations ul span, .companies.locations ul a").prepend("Companies hiring in ");
$(".companies:not(.locations) ul span, .companies:not(.locations) ul a").prepend("Companies hiring for ");

// set heirarchical classes for styles
$(".lvl-1 > ul > li").addClass("lvl-2");
$(".lvl-2 > ul > li").addClass("lvl-3");
$(".lvl-3 > ul > li").addClass("lvl-4");


// toggle functionality
var toggle = function () {
    $(this).parent().toggleClass("open");
    $(this).parent().siblings(".open").toggleClass("open");
    $(this).parent().siblings().find(".open").toggleClass("open");
    $(this).closest(".lvl-0").siblings().find(".open").toggleClass("open");
    var divPosition = $(this).position().top + 50;
    $("html, body").animate({ scrollTop: divPosition}, 400);
}
$("li:not(.lvl-0) div").click(toggle)

var flyoutHide = function () {
    $("#flyout").toggleClass("flyout--hide");
}
$(".nav--jobs").click(flyoutHide)